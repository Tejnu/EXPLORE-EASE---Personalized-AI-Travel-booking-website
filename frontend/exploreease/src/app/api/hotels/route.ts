import { NextResponse } from "next/server";
import fs from "fs";
import { parse } from "csv-parse/sync";

const DATASET_PATH = "D:/project/explore_ease/DATASETS/google_hotel_data_clean.csv";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const cityParam = (searchParams.get("city") || "").trim().toLowerCase();
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000");
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const featuresParam = searchParams.getAll("feature").map((f) => f.toLowerCase());

  if (!fs.existsSync(DATASET_PATH)) {
    return NextResponse.json({ success: false, error: "Hotel data not found", hotels: [] }, { status: 500 });
  }

  try {
    const csvData = fs.readFileSync(DATASET_PATH, "utf8");
    const records = parse(csvData, { columns: true, skip_empty_lines: true, trim: true });
    const hotels = records
      .filter((row: any) =>
        (!cityParam || (row.City && row.City.trim().toLowerCase() === cityParam)) &&
        (!minPrice || (parseFloat(row.Hotel_Price) >= minPrice)) &&
        (!maxPrice || (parseFloat(row.Hotel_Price) <= maxPrice)) &&
        (!minRating || (parseFloat(row.Hotel_Rating) >= minRating)) &&
        (featuresParam.length === 0 ||
          featuresParam.every((f) =>
            // Make feature matching robust to missing/null values
            Array.from({ length: 9 })
              .map((_, i) => row[`Feature_${i + 1}`])
              .filter(x => !!x && x !== "0")
              .map(x => x.toLowerCase())
              .some(x => x.includes(f))
          ))
      )
      .map((row: any, idx: number) => ({
        id: idx + 1,
        name: row.Hotel_Name,
        rating: parseFloat(row.Hotel_Rating),
        city: row.City,
        features: Array.from({ length: 9 })
          .map((_, i) => row[`Feature_${i + 1}`])
          .filter(x => !!x && x !== "0"),
        price: parseFloat(row.Hotel_Price),
      }));

    return NextResponse.json({ success: true, hotels });
  } catch (error) {
    console.error("Error reading hotel data:", error);
    return NextResponse.json({ success: false, error: "Failed to load hotel data", hotels: [] }, { status: 500 });
  }
}
