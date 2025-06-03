import { NextResponse } from 'next/server';

// Sample flight data
const FLIGHTS = [
  {
    id: 1,
    airline: 'Emirates',
    flightNumber: 'EK502',
    from: 'DXB',
    fromName: 'Dubai',
    to: 'JFK',
    toName: 'New York',
    departureTime: '02:50',
    arrivalTime: '08:50',
    duration: '14h 00m',
    stops: 0,
    price: 2450,
    seatsAvailable: 22,
    class: 'Economy',
    aircraft: 'Boeing 777-300ER',
    logo: 'https://ugc.same-assets.com/emirates-logo.png'
  },
  {
    id: 2,
    airline: 'Qatar Airways',
    flightNumber: 'QR701',
    from: 'DXB',
    fromName: 'Dubai',
    to: 'JFK',
    toName: 'New York',
    departureTime: '03:40',
    arrivalTime: '13:15',
    duration: '17h 35m',
    stops: 1,
    stopDetails: [
      {
        airport: 'DOH',
        city: 'Doha',
        duration: '2h 15m'
      }
    ],
    price: 2340,
    seatsAvailable: 8,
    class: 'Economy',
    aircraft: 'Airbus A350-900',
    logo: 'https://ugc.same-assets.com/qatar-airways-logo.png'
  },
  {
    id: 3,
    airline: 'Etihad Airways',
    flightNumber: 'EY255',
    from: 'DXB',
    fromName: 'Dubai',
    to: 'JFK',
    toName: 'New York',
    departureTime: '10:30',
    arrivalTime: '16:30',
    duration: '14h 00m',
    stops: 0,
    price: 2550,
    seatsAvailable: 15,
    class: 'Economy',
    aircraft: 'Boeing 787-9',
    logo: 'https://ugc.same-assets.com/etihad-logo.png'
  },
  {
    id: 4,
    airline: 'Emirates',
    flightNumber: 'EK206',
    from: 'DXB',
    fromName: 'Dubai',
    to: 'JFK',
    toName: 'New York',
    departureTime: '08:30',
    arrivalTime: '14:25',
    duration: '13h 55m',
    stops: 0,
    price: 2480,
    seatsAvailable: 3,
    class: 'Economy',
    aircraft: 'Airbus A380-800',
    logo: 'https://ugc.same-assets.com/emirates-logo.png'
  },
  {
    id: 5,
    airline: 'Turkish Airlines',
    flightNumber: 'TK55',
    from: 'DXB',
    fromName: 'Dubai',
    to: 'JFK',
    toName: 'New York',
    departureTime: '00:35',
    arrivalTime: '13:40',
    duration: '19h 05m',
    stops: 1,
    stopDetails: [
      {
        airport: 'IST',
        city: 'Istanbul',
        duration: '3h 10m'
      }
    ],
    price: 2120,
    seatsAvailable: 12,
    class: 'Economy',
    aircraft: 'Boeing 777-300ER',
    logo: 'https://ugc.same-assets.com/turkish-airlines-logo.png'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const passengers = searchParams.get('passengers') || '1';
  const flightClass = searchParams.get('class') || 'Economy';

  // If no params, return all flights
  if (!from && !to) {
    return NextResponse.json({ flights: FLIGHTS });
  }

  // Filter flights based on search params
  const filteredFlights = FLIGHTS.filter(flight => {
    const fromMatch = !from || flight.from.toLowerCase().includes(from.toLowerCase()) || flight.fromName.toLowerCase().includes(from.toLowerCase());
    const toMatch = !to || flight.to.toLowerCase().includes(to.toLowerCase()) || flight.toName.toLowerCase().includes(to.toLowerCase());
    const classMatch = !flightClass || flight.class.toLowerCase() === flightClass.toLowerCase();

    // We'd normally check dates here too
    return fromMatch && toMatch && classMatch;
  });

  return NextResponse.json({
    flights: filteredFlights,
    filters: {
      from,
      to,
      date,
      passengers,
      class: flightClass
    }
  });
}

// For booking a flight
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Here you would typically validate the request data
    // and store the booking information in a database

    // For now, just return a mock booking confirmation
    return NextResponse.json({
      success: true,
      bookingId: `FLT-${Date.now()}`,
      message: 'Flight booking successful!'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process your booking request' },
      { status: 400 }
    );
  }
}
