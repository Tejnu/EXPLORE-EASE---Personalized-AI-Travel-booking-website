import { NextResponse } from "next/server";
import fs from "fs";
import { parse } from "csv-parse/sync";

// Map weekday to run column
const DAY_COLS = {
  Sun: "trainRunsOnSun",
  Mon: "trainRunsOnMon",
  Tue: "trainRunsOnTue",
  Wed: "trainRunsOnWed",
  Thu: "trainRunsOnThu",
  Fri: "trainRunsOnFri",
  Sat: "trainRunsOnSat",
} as const;
type DayAbbr = keyof typeof DAY_COLS;

// What classes do we support
const CLASS_KEYS = ["1A", "2A", "3A", "SL", "CC", "EC"] as const;

// Parse Python/JSON single quote array to JS array of stops
function tryParseStationList(str: string): { stationCode: string, stationName?: string, arrivalTime?: string, departureTime?: string }[] {
  try {
    return JSON.parse(str.replace(/'/g, '"'));
  } catch {
    return [];
  }
}

// Get cumulative fare difference for a segment and class
function getSegmentFare(
  fareRows: any[],
  trainNo: string,
  from: string,
  to: string,
  classKey: string
): number | null {
  const segRows = fareRows.filter((f: any) => f.Train_No == trainNo);
  const fromRow = segRows.find((f: any) => f.Station_Code === from);
  const toRow = segRows.find((f: any) => f.Station_Code === to);
  if (!fromRow || !toRow) return null;
  const diff = Number(toRow[classKey]) - Number(fromRow[classKey]);
  // If boarding at origin, just take the toRow fare
  return diff >= 0 ? diff : Number(toRow[classKey]);
}

// Build business logic/mocked availability
function buildAvailability(
  classes: string[],
  seats: number = 32
): Record<string, { status: string; number: number; prediction: string }> {
  const out: Record<string, any> = {};
  for (const c of classes) {
    if (c === "1A" || c === "EC") out[c] = { status: "AVBL", number: seats, prediction: "high" };
    else if (c === "2A" || c === "CC") out[c] = { status: "RAC", number: Math.floor(seats / 4), prediction: "medium" };
    else if (c === "3A") out[c] = { status: "WL", number: Math.floor(seats / 2), prediction: "low" };
    else out[c] = { status: "AVBL", number: Math.floor(Math.random() * seats), prediction: "medium" };
  }
  return out;
}

// Duration calculation
function calculateDuration(dep: string, arr: string): string | null {
  if (!dep || !arr) return null;
  const [dh, dm] = dep.split(":").map(Number);
  const [ah, am] = arr.split(":").map(Number);
  let start = dh * 60 + dm;
  let end = ah * 60 + am;
  if (end < start) end += 24 * 60;
  const dur = end - start;
  return `${Math.floor(dur / 60)}h ${dur % 60}m`;
}

// Extract "PUNE" from "Pune (PUNE)"
function extractStationCode(val: string): string {
  if (!val) return "";
  const match = val.match(/\(([A-Z0-9]+)\)$/i);
  if (match) return match[1].toUpperCase();
  return val.trim().toUpperCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const fromParam = extractStationCode(searchParams.get("from") || "");
  const toParam = extractStationCode(searchParams.get("to") || "");
  const dateParam = (searchParams.get("date") || "").trim();
  const classParam = (searchParams.get("class") || "").trim().toUpperCase();

  const timetablePath = "D:/Projects/DTI Project/ExploreEase/datasets/Train_schedule_final.csv";
  const farePath = "D:/Projects/DTI Project/ExploreEase/datasets/train_schedule.csv";

  if (!fs.existsSync(timetablePath) || !fs.existsSync(farePath)) {
    return NextResponse.json(
      { success: false, error: "Data file(s) not found", trains: [] },
      { status: 500 }
    );
  }

  try {
    // --- Main train timetable ---
    const raw = fs.readFileSync(timetablePath, "utf8");
    const records = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const fareRaw = fs.readFileSync(farePath, "utf8");
    const fareRows = parse(fareRaw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // --- Day of week filter ---
    let dayCol: typeof DAY_COLS[DayAbbr] | null = null;
    if (dateParam) {
      const dt = new Date(dateParam);
      const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dt.getDay()] as DayAbbr;
      dayCol = DAY_COLS[weekDay];
    }

    // --- Filter trains: pass-through, correct day ---
    const trains = records
      .filter((row: any) => {
        if (dayCol && row[dayCol] && row[dayCol] !== "Y") return false;
        const stations = tryParseStationList(row.stationList as string);
        const fromIdx = stations.findIndex((s: any) => s.stationCode === fromParam);
        const toIdx = stations.findIndex((s: any) => s.stationCode === toParam);
        return fromIdx >= 0 && toIdx > fromIdx;
      })
      .map((row: any, idx: number) => {
        const trainNum = row.trainNumber?.toString() || row.trainNo?.toString() || "";
        const trainName = row.trainName || row.train_name || "";
        const stations = tryParseStationList(row.stationList as string);

        const fromIdx = stations.findIndex((s: any) => s.stationCode === fromParam);
        const toIdx = stations.findIndex((s: any) => s.stationCode === toParam);

        const fromStop = stations[fromIdx];
        const toStop = stations[toIdx];

        // Classes for this segment
        const toFareRow = fareRows.find((f: any) => f.Train_No == trainNum && f.Station_Code === toParam);
        const classes = CLASS_KEYS.filter((k) => (toFareRow && toFareRow[k]) && !isNaN(Number(toFareRow[k])));

        // Fares for each class
        const fare: Record<string, number> = {};
        for (const classKey of classes) {
          const segmentFare = getSegmentFare(fareRows, trainNum || "", fromParam || "", toParam || "", classKey);
          if (segmentFare != null) fare[classKey] = segmentFare;
        }

        // Availability object for all classes
        const availability = buildAvailability(classes);

        return {
          id: idx + 1,
          number: trainNum,
          name: trainName,
          from: fromParam,
          fromName: fromStop?.stationName || "",
          to: toParam,
          toName: toStop?.stationName || "",
          departureTime: fromStop?.departureTime || "",
          arrivalTime: toStop?.arrivalTime || "",
          duration: calculateDuration(fromStop?.departureTime || "", toStop?.arrivalTime || ""),
          classes,
          fare,
          availability,
        };
      });

    return NextResponse.json({ success: true, trains });
  } catch (error) {
    console.error("Error reading train data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load train data", trains: [] },
      { status: 500 }
    );
  }
}
