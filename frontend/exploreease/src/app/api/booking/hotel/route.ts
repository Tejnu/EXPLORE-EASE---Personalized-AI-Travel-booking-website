import { NextResponse } from "next/server";
import fs from "fs";
import { parse } from "csv-parse/sync";

const DATASET_PATH = "D:/Projects/DTI Project/ExploreEase/datasets/google_hotel_data_clean.csv";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Always lowercase city for matching
  const cityParam = (searchParams.get("city") || "").trim().toLowerCase();
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000");
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const featuresParam = searchParams.getAll("feature").map((f: string) => f.toLowerCase());

  if (!fs.existsSync(DATASET_PATH)) {
    return NextResponse.json({ success: false, error: "Hotel data not found", hotels: [] }, { status: 500 });
  }

  try {
    const csvData = fs.readFileSync(DATASET_PATH, "utf8");
    const records = parse(csvData, { columns: true, skip_empty_lines: true, trim: true });

    const hotels = records
      .map((row: any, idx: number) => ({
        id: idx + 1,
        name: row.Hotel_Name,
        city: (row.City || "").trim().toLowerCase(),
        rating: isNaN(Number(row.Hotel_Rating)) ? 0 : parseFloat(row.Hotel_Rating),
        features: Array.from({ length: 9 })
          .map((_, i) => row[`Feature_${i + 1}`])
          .filter((x: any) => !!x && x !== "0"),
        price: isNaN(Number(row.Hotel_Price)) ? 0 : parseFloat(row.Hotel_Price),
      }))
      .filter((hotel: any) =>
        (!cityParam || hotel.city === cityParam) &&
        (hotel.price >= minPrice) &&
        (hotel.price <= maxPrice) &&
        (hotel.rating >= minRating) &&
        (featuresParam.length === 0 ||
          featuresParam.every((f: string) =>
            hotel.features.some((x: string) => x.toLowerCase().includes(f))
          )
        )
      );

    return NextResponse.json({ success: true, hotels });
  } catch (error) {
    console.error("Error reading hotel data:", error);
    return NextResponse.json({ success: false, error: "Failed to load hotel data", hotels: [] }, { status: 500 });
  }
}
