import { NextResponse } from 'next/server';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Logo mapping (keys are lowercase, matching CSV airline names)
const AIRLINE_LOGOS: Record<string, string> = {
  'air india': '/airlines/airindia.svg',
  'indigo': '/airlines/indigo.svg',
  'go first': '/airlines/gofirst.svg',
  'vistara': '/airlines/vistara.svg',
  'spicejet': '/airlines/spicejet.svg',
  'airasia': '/airlines/airasia.svg'
};
const FALLBACK_LOGO = '/airlines/placeholder.svg';

function getAirlineLogo(rawAirline: string) {
  if (!rawAirline) return FALLBACK_LOGO;
  const airline = rawAirline.trim().toLowerCase();
  // Try direct match
  if (AIRLINE_LOGOS[airline]) return AIRLINE_LOGOS[airline];
  // Try fuzzy match: ignore all spaces
  const cleanAirline = airline.replace(/\s+/g, '');
  const match = Object.keys(AIRLINE_LOGOS).find(
    key => key.replace(/\s+/g, '') === cleanAirline
  );
  return match ? AIRLINE_LOGOS[match] : FALLBACK_LOGO;
}

function parsePrice(str: string) {
  return Number(str.replace(/,/g, '').replace(/"/g, '').trim()) || 0;
}

function cleanStops(stops: string | undefined | null): string {
  if (!stops) return '';
  return stops.replace(/\n/g, ' ').replace(/Via.*/gi, '').replace(/\s+/g, ' ').trim();
}

type Flight = {
  id: number;
  flightDate: string;
  airline: string;
  logo: string;
  flightNumber: string;
  class: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const fromParam = (searchParams.get('from') || '').trim().toLowerCase();
  const toParam = (searchParams.get('to') || '').trim().toLowerCase();
  const dateParam = (searchParams.get('date') || '').trim();
  const classParam = (searchParams.get('class') || '').trim().toLowerCase();

  const DATASET_PATH = 'D:/Projects/DTI Project/ExploreEase/datasets/cleaned_flight_data.csv';

  try {
    const csvData = fs.readFileSync(DATASET_PATH, 'utf8');
    const records = parse(csvData, { columns: true, skip_empty_lines: true, trim: true });

    const flights: Flight[] = records
      .map((row: any, idx: number): Flight => {
        const airline = row['airline'] || '';
        return {
          id: idx + 1,
          flightDate: (row['flight date'] || '').trim(),
          airline,
          logo: getAirlineLogo(airline),
          flightNumber: (row['flight_num'] || '').trim(),
          class: (row['class'] || '').trim(),
          from: (row['from'] || '').trim(),
          to: (row['to'] || '').trim(),
          departureTime: (row['dep_time'] || '').trim(),
          arrivalTime: (row['arr_time'] || '').trim(),
          duration: (row['duration'] || '').trim(),
          price: parsePrice(row['price'] || ''),
          stops: cleanStops(row['stops'] || ''),
        }
      })
      .filter((f: Flight) => {
        const fromCSV = (f.from || '').trim().toLowerCase();
        const toCSV = (f.to || '').trim().toLowerCase();
        const classCSV = (f.class || '').trim().toLowerCase();
        const dateCSV = (f.flightDate || '').trim();
        return (
          (!fromParam || fromCSV === fromParam) &&
          (!toParam || toCSV === toParam) &&
          (!dateParam || dateCSV === dateParam) &&
          (!classParam || classCSV === classParam)
        );
      });

    return NextResponse.json({ success: true, flights });
  } catch (error) {
    console.error('Error reading flight data:', error);
    return NextResponse.json({ success: false, flights: [] }, { status: 500 });
  }
}
