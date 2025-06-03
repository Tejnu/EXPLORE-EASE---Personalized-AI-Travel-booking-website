import { NextResponse } from 'next/server';

// Sample train data
const TRAINS = [
  {
    id: 1,
    number: '12952',
    name: 'NDLS MMCT RAJDHANI',
    from: 'NDLS',
    fromName: 'New Delhi',
    to: 'BCT',
    toName: 'Mumbai Central',
    departureTime: '16:25',
    arrivalTime: '08:15',
    duration: '15h 50m',
    classes: ['1A', '2A', '3A'],
    availability: {
      'SL': { status: 'WL', number: 42, prediction: 'low' },
      '3A': { status: 'RAC', number: 18, prediction: 'medium' },
      '2A': { status: 'AVBL', number: 5, prediction: 'high' },
      '1A': { status: 'AVBL', number: 2, prediction: 'high' },
    },
    fare: {
      'SL': 755,
      '3A': 1990,
      '2A': 2860,
      '1A': 4755,
    }
  },
  {
    id: 2,
    number: '22221',
    name: 'CSMT RAJDHANI',
    from: 'NDLS',
    fromName: 'New Delhi',
    to: 'CSMT',
    toName: 'Mumbai CSMT',
    departureTime: '16:10',
    arrivalTime: '08:35',
    duration: '16h 25m',
    classes: ['3A', '2A', '1A'],
    availability: {
      '3A': { status: 'AVBL', number: 24, prediction: 'high' },
      '2A': { status: 'AVBL', number: 8, prediction: 'high' },
      '1A': { status: 'AVBL', number: 3, prediction: 'high' },
    },
    fare: {
      '3A': 1940,
      '2A': 2810,
      '1A': 4680,
    }
  },
  {
    id: 3,
    number: '12954',
    name: 'AUGUST KRANTI RAJ',
    from: 'NDLS',
    fromName: 'New Delhi',
    to: 'BCT',
    toName: 'Mumbai Central',
    departureTime: '17:05',
    arrivalTime: '10:55',
    duration: '17h 50m',
    classes: ['SL', '3A', '2A', '1A'],
    availability: {
      'SL': { status: 'WL', number: 12, prediction: 'medium' },
      '3A': { status: 'AVBL', number: 12, prediction: 'high' },
      '2A': { status: 'RAC', number: 6, prediction: 'medium' },
      '1A': { status: 'AVBL', number: 2, prediction: 'high' },
    },
    fare: {
      'SL': 710,
      '3A': 1885,
      '2A': 2740,
      '1A': 4585,
    }
  },
  {
    id: 4,
    number: '12910',
    name: 'NDLS BCT GARIB RATH',
    from: 'NDLS',
    fromName: 'New Delhi',
    to: 'BCT',
    toName: 'Mumbai Central',
    departureTime: '15:35',
    arrivalTime: '08:40',
    duration: '17h 05m',
    classes: ['3A'],
    availability: {
      '3A': { status: 'AVBL', number: 52, prediction: 'high' },
    },
    fare: {
      '3A': 1245,
    }
  },
  {
    id: 5,
    number: '12926',
    name: 'PASCHIM EXPRESS',
    from: 'NDLS',
    fromName: 'New Delhi',
    to: 'BCT',
    toName: 'Mumbai Central',
    departureTime: '11:25',
    arrivalTime: '05:50',
    duration: '18h 25m',
    classes: ['SL', '3A', '2A'],
    availability: {
      'SL': { status: 'AVBL', number: 246, prediction: 'high' },
      '3A': { status: 'AVBL', number: 65, prediction: 'high' },
      '2A': { status: 'AVBL', number: 12, prediction: 'high' },
    },
    fare: {
      'SL': 580,
      '3A': 1525,
      '2A': 2200,
    }
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  // If no params, return all trains
  if (!from && !to) {
    return NextResponse.json({ trains: TRAINS });
  }

  // Filter trains based on search params
  const filteredTrains = TRAINS.filter(train => {
    const fromMatch = !from || train.from.toLowerCase().includes(from.toLowerCase()) || train.fromName.toLowerCase().includes(from.toLowerCase());
    const toMatch = !to || train.to.toLowerCase().includes(to.toLowerCase()) || train.toName.toLowerCase().includes(to.toLowerCase());

    // We'd normally check dates here too
    return fromMatch && toMatch;
  });

  return NextResponse.json({
    trains: filteredTrains,
    filters: {
      from,
      to,
      date
    }
  });
}

// For booking a train ticket
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Here you would typically validate the request data
    // and store the booking information in a database

    // For now, just return a mock booking confirmation
    return NextResponse.json({
      success: true,
      bookingId: `TRN-${Date.now()}`,
      message: 'Train booking successful!'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process your booking request' },
      { status: 400 }
    );
  }
}
