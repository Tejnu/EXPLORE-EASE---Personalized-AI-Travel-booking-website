import { NextResponse } from 'next/server';

// Sample bus data
const BUSES = [
  {
    id: 1,
    operatorName: 'Greyhound Express',
    operatorRating: 4.5,
    busType: 'AC Sleeper',
    from: 'New York',
    to: 'Washington DC',
    departureDate: '2025-04-15',
    departureTime: '07:30',
    arrivalDate: '2025-04-15',
    arrivalTime: '11:45',
    duration: '4h 15m',
    fare: 35,
    currency: 'USD',
    availableSeats: 23,
    totalSeats: 40,
    amenities: ['Wi-Fi', 'Charging Point', 'Water Bottle', 'Blanket'],
    cancellationPolicy: 'Free cancellation up to 24 hours before departure',
    ratings: {
      punctuality: 4.3,
      cleanliness: 4.6,
      staff: 4.4,
      comfort: 4.7
    },
    pickupPoints: [
      {
        name: 'Port Authority Bus Terminal',
        address: '625 8th Ave, New York, NY 10018',
        time: '07:30'
      },
      {
        name: 'George Washington Bridge Bus Terminal',
        address: '4211 Broadway, New York, NY 10033',
        time: '08:00'
      }
    ],
    dropoffPoints: [
      {
        name: 'Union Station',
        address: '50 Massachusetts Ave NE, Washington, DC 20002',
        time: '11:45'
      },
      {
        name: 'Dupont Circle',
        address: 'Connecticut Ave & Q St NW, Washington, DC 20036',
        time: '12:00'
      }
    ]
  },
  {
    id: 2,
    operatorName: 'BoltBus',
    operatorRating: 4.3,
    busType: 'AC Seater',
    from: 'New York',
    to: 'Boston',
    departureDate: '2025-04-15',
    departureTime: '08:45',
    arrivalDate: '2025-04-15',
    arrivalTime: '12:30',
    duration: '3h 45m',
    fare: 29,
    currency: 'USD',
    availableSeats: 15,
    totalSeats: 38,
    amenities: ['Wi-Fi', 'Charging Point', 'Snacks', 'TV'],
    cancellationPolicy: 'Free cancellation up to 12 hours before departure',
    ratings: {
      punctuality: 4.0,
      cleanliness: 4.2,
      staff: 4.3,
      comfort: 4.1
    },
    pickupPoints: [
      {
        name: 'Port Authority Bus Terminal',
        address: '625 8th Ave, New York, NY 10018',
        time: '08:45'
      }
    ],
    dropoffPoints: [
      {
        name: 'South Station',
        address: '700 Atlantic Ave, Boston, MA 02110',
        time: '12:30'
      }
    ]
  },
  {
    id: 3,
    operatorName: 'Rajasthan State Transport',
    operatorRating: 4.1,
    busType: 'AC Sleeper',
    from: 'Delhi',
    to: 'Jaipur',
    departureDate: '2025-04-15',
    departureTime: '21:00',
    arrivalDate: '2025-04-16',
    arrivalTime: '04:30',
    duration: '7h 30m',
    fare: 950,
    currency: 'INR',
    availableSeats: 8,
    totalSeats: 30,
    amenities: ['Wi-Fi', 'Charging Point', 'Blanket', 'Water Bottle'],
    cancellationPolicy: 'Free cancellation up to 24 hours before departure',
    ratings: {
      punctuality: 3.8,
      cleanliness: 4.0,
      staff: 4.2,
      comfort: 4.0
    },
    pickupPoints: [
      {
        name: 'Kashmere Gate ISBT',
        address: 'Lothian Road, Kashmere Gate, Delhi, 110006',
        time: '21:00'
      },
      {
        name: 'Dhaula Kuan',
        address: 'NH 48, Dhaula Kuan, New Delhi, 110021',
        time: '21:45'
      }
    ],
    dropoffPoints: [
      {
        name: 'Sindhi Camp Bus Stand',
        address: 'Station Road, Sindhi Camp, Jaipur, Rajasthan 302006',
        time: '04:30'
      }
    ]
  },
  {
    id: 4,
    operatorName: 'Redbus Express',
    operatorRating: 4.6,
    busType: 'Volvo AC Sleeper',
    from: 'Mumbai',
    to: 'Pune',
    departureDate: '2025-04-15',
    departureTime: '19:00',
    arrivalDate: '2025-04-15',
    arrivalTime: '22:30',
    duration: '3h 30m',
    fare: 750,
    currency: 'INR',
    availableSeats: 12,
    totalSeats: 32,
    amenities: ['Wi-Fi', 'Charging Point', 'Blanket', 'Water Bottle', 'Entertainment System'],
    cancellationPolicy: 'Free cancellation up to 12 hours before departure',
    ratings: {
      punctuality: 4.4,
      cleanliness: 4.7,
      staff: 4.5,
      comfort: 4.8
    },
    pickupPoints: [
      {
        name: 'Dadar',
        address: 'Dadar East, Mumbai, Maharashtra 400014',
        time: '19:00'
      },
      {
        name: 'Sion',
        address: 'Sion, Mumbai, Maharashtra 400022',
        time: '19:30'
      }
    ],
    dropoffPoints: [
      {
        name: 'Pune Station',
        address: 'Pune Railway Station, Pune, Maharashtra 411001',
        time: '22:30'
      },
      {
        name: 'Shivaji Nagar',
        address: 'Shivaji Nagar, Pune, Maharashtra 411005',
        time: '22:45'
      }
    ]
  },
  {
    id: 5,
    operatorName: 'Megabus',
    operatorRating: 4.2,
    busType: 'Double Decker AC',
    from: 'London',
    to: 'Manchester',
    departureDate: '2025-04-15',
    departureTime: '10:15',
    arrivalDate: '2025-04-15',
    arrivalTime: '15:00',
    duration: '4h 45m',
    fare: 25,
    currency: 'GBP',
    availableSeats: 34,
    totalSeats: 72,
    amenities: ['Wi-Fi', 'Charging Point', 'Air Conditioning', 'Toilet'],
    cancellationPolicy: 'Free cancellation up to 24 hours before departure',
    ratings: {
      punctuality: 4.0,
      cleanliness: 4.1,
      staff: 4.2,
      comfort: 4.0
    },
    pickupPoints: [
      {
        name: 'Victoria Coach Station',
        address: 'Buckingham Palace Road, London SW1W 9TN',
        time: '10:15'
      }
    ],
    dropoffPoints: [
      {
        name: 'Manchester Coach Station',
        address: 'Chorlton St, Manchester M1 3JF',
        time: '15:00'
      }
    ]
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const busType = searchParams.get('busType');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  // If no params, return all buses
  if (!from && !to && !date) {
    return NextResponse.json({ buses: BUSES });
  }

  // Filter buses based on search params
  let filteredBuses = [...BUSES];

  if (from) {
    filteredBuses = filteredBuses.filter(bus =>
      bus.from.toLowerCase().includes(from.toLowerCase())
    );
  }

  if (to) {
    filteredBuses = filteredBuses.filter(bus =>
      bus.to.toLowerCase().includes(to.toLowerCase())
    );
  }

  if (date) {
    filteredBuses = filteredBuses.filter(bus => bus.departureDate === date);
  }

  if (busType) {
    filteredBuses = filteredBuses.filter(bus =>
      bus.busType.toLowerCase().includes(busType.toLowerCase())
    );
  }

  if (minPrice) {
    filteredBuses = filteredBuses.filter(bus => bus.fare >= Number(minPrice));
  }

  if (maxPrice) {
    filteredBuses = filteredBuses.filter(bus => bus.fare <= Number(maxPrice));
  }

  return NextResponse.json({
    buses: filteredBuses,
    filters: {
      from,
      to,
      date,
      busType,
      minPrice,
      maxPrice
    }
  });
}

// For booking a bus
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Here you would typically validate the request data
    // and store the booking information in a database

    // For now, just return a mock booking confirmation
    return NextResponse.json({
      success: true,
      bookingId: `BUS-${Date.now()}`,
      message: 'Bus booking successful!',
      details: {
        operatorName: data.operatorName || 'Selected Bus Operator',
        from: data.from,
        to: data.to,
        departureDate: data.departureDate,
        departureTime: data.departureTime,
        seats: data.seats,
        passengers: data.passengers,
        amount: data.amount
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process your booking request' },
      { status: 400 }
    );
  }
}
