/**
 * API service for the MakeMyTrip clone
 * This file contains functions to interact with our backend API
 */

// Base API URL - will be relative in production
const API_BASE_URL = '/api';

// Types
export interface TrainSearchParams {
  from?: string;
  to?: string;
  date?: string;
  class?: string;
  quota?: string;
  passengers?: number;
}

export interface FlightSearchParams {
  from?: string;
  to?: string;
  date?: string;
  returnDate?: string;
  class?: string;
  adults?: number;
  children?: number;
  infants?: number;
  tripType?: 'one-way' | 'round-trip' | 'multi-city';
}

export interface HotelSearchParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;       // Use 'rating' for min rating
  features?: string[];
}

export interface BusSearchParams {
  from?: string;
  to?: string;
  date?: string;
  busType?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BookingParams {
  type: 'train' | 'flight' | 'hotel' | 'bus';
  id: number;
  class?: string;
  passengers: {
    name: string;
    age?: number;
    gender?: string;
    seatPreference?: string;
  }[];
  contactInfo: {
    email: string;
    phone: string;
  };
  paymentInfo?: any;
}

// API Functions

/**
 * Search for trains based on provided parameters
 */
export async function searchTrains(params: TrainSearchParams) {
  const queryParams = new URLSearchParams();
  if (params.from) queryParams.append('from', params.from);
  if (params.to) queryParams.append('to', params.to);
  if (params.date) queryParams.append('date', params.date);
  if (params.class) queryParams.append('class', params.class);
  if (params.quota) queryParams.append('quota', params.quota);
  if (params.passengers) queryParams.append('passengers', params.passengers.toString());

  try {
    // CHANGE this line to call "/booking/train" instead of "/trains"
    const response = await fetch(`${API_BASE_URL}/booking/train?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch trains');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching trains:', error);
    throw error;
  }
}

/**
 * Search for flights based on provided parameters
 */
export async function searchFlights(params: FlightSearchParams) {
  const queryParams = new URLSearchParams();
  if (params.from) queryParams.append('from', params.from);
  if (params.to) queryParams.append('to', params.to);
  if (params.date) queryParams.append('date', params.date);
  if (params.returnDate) queryParams.append('returnDate', params.returnDate);
  if (params.class) queryParams.append('class', params.class);

  // Combine all passenger types into a single count
  const totalPassengers = (params.adults || 0) + (params.children || 0) + (params.infants || 0);
  if (totalPassengers > 0) queryParams.append('passengers', totalPassengers.toString());

  if (params.tripType) queryParams.append('tripType', params.tripType);

  try {
    // ------ CHANGE THIS LINE ------
    const response = await fetch(`${API_BASE_URL}/booking/flight?${queryParams.toString()}`);
    // -----------------------------
    if (!response.ok) {
      throw new Error('Failed to fetch flights');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
}


export async function searchHotels(params: HotelSearchParams) {
  const queryParams = new URLSearchParams();
  if (params.city) queryParams.append('city', params.city.toLowerCase());
  if (params.checkIn) queryParams.append('checkIn', params.checkIn);
  if (params.checkOut) queryParams.append('checkOut', params.checkOut);
  if (params.guests) queryParams.append('guests', params.guests.toString());
  if (params.rooms) queryParams.append('rooms', params.rooms.toString());
  if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params.rating) queryParams.append('minRating', params.rating.toString());
  if (params.features)
    params.features.forEach((f: string) => queryParams.append('feature', f.toLowerCase()));

  const response = await fetch(`/api/booking/hotel?${queryParams.toString()}`);

  if (!response.ok) throw new Error('Failed to fetch hotels');
  return await response.json();
}


/**
 * Search for buses based on provided parameters
 */
export async function searchBuses(params: BusSearchParams) {
  const queryParams = new URLSearchParams();
  if (params.from) queryParams.append('from', params.from);
  if (params.to) queryParams.append('to', params.to);
  if (params.date) queryParams.append('date', params.date);
  if (params.busType) queryParams.append('busType', params.busType);
  if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

  try {
    const response = await fetch(`${API_BASE_URL}/buses?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch buses');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching buses:', error);
    throw error;
  }
}

/**
 * Book a train, flight, hotel or bus
 */
export async function createBooking(bookingData: BookingParams) {
  try {
    let endpoint;
    switch (bookingData.type) {
      case 'train':
        endpoint = 'trains';
        break;
      case 'flight':
        endpoint = 'flights';
        break;
      case 'hotel':
        endpoint = 'hotels';
        break;
      case 'bus':
        endpoint = 'buses';
        break;
      default:
        throw new Error(`Invalid booking type: ${bookingData.type}`);
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create ${bookingData.type} booking`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error creating ${bookingData.type} booking:`, error);
    throw error;
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string, bookingType: 'train' | 'flight' | 'hotel' | 'bus') {
  try {
    let endpoint;
    switch (bookingType) {
      case 'train':
        endpoint = 'trains';
        break;
      case 'flight':
        endpoint = 'flights';
        break;
      case 'hotel':
        endpoint = 'hotels';
        break;
      case 'bus':
        endpoint = 'buses';
        break;
      default:
        throw new Error(`Invalid booking type: ${bookingType}`);
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel ${bookingType} booking`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error cancelling ${bookingType} booking:`, error);
    throw error;
  }
}
