'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Trip {
  bookingId: string;
  paymentId: string;
  service: 'train' | 'flight' | 'hotel';
  date: string;
  status: string;
  amount: number;
  details: any;
}

const formatDate = (dateString: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (e) {
    return dateString;
  }
};

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  useEffect(() => {
    // Fetch trips from localStorage
    const fetchTrips = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
          setTrips(savedTrips);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Filter trips based on selected tab
  const filteredTrips = activeTab === 'all' 
    ? trips 
    : trips.filter(trip => trip.service === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#ffa726] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#232e3d] mb-6">My Trips</h1>
        
        {/* Tabs */}
        <div className="bg-white mb-6 p-1 border rounded-lg flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md mr-2 ${activeTab === 'all' 
              ? 'bg-[#ffa726] text-white' 
              : 'text-[#232e3d] hover:bg-gray-100'}`}
          >
            All Trips
          </button>
          <button 
            onClick={() => setActiveTab('train')}
            className={`px-4 py-2 rounded-md mr-2 ${activeTab === 'train' 
              ? 'bg-[#ffa726] text-white' 
              : 'text-[#232e3d] hover:bg-gray-100'}`}
          >
            Train Tickets
          </button>
          <button 
            onClick={() => setActiveTab('flight')}
            className={`px-4 py-2 rounded-md mr-2 ${activeTab === 'flight' 
              ? 'bg-[#ffa726] text-white' 
              : 'text-[#232e3d] hover:bg-gray-100'}`}
          >
            Flight Tickets
          </button>
          <button 
            onClick={() => setActiveTab('hotel')}
            className={`px-4 py-2 rounded-md mr-2 ${activeTab === 'hotel' 
              ? 'bg-[#ffa726] text-white' 
              : 'text-[#232e3d] hover:bg-gray-100'}`}
          >
            Hotel Bookings
          </button>
        </div>
        
        {/* Content */}
        {filteredTrips.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-semibold text-[#232e3d] mb-2">No trips found</h2>
            <p className="text-gray-600 mb-4">
              {activeTab === 'all' 
                ? "You haven't made any bookings yet." 
                : `You haven't made any ${activeTab} bookings yet.`}
            </p>
            <button 
              onClick={() => router.push('/')}
              className="bg-[#ffa726] hover:bg-[#ff9800] text-white px-6 py-2 rounded-lg"
            >
              Explore & Book Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <div key={trip.bookingId} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-bold text-[#232e3d]">
                          {trip.service === 'train' ? 'Train Trip' : 
                           trip.service === 'flight' ? 'Flight Trip' : 
                           'Hotel Stay'}
                        </h3>
                        <span className={`ml-2 text-xs ${
                          trip.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          trip.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        } px-2.5 py-0.5 rounded-full`}>
                          {trip.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Booking ID: {trip.bookingId}</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2 md:mt-0">
                      <span className="font-medium">Booked on:</span> {formatDate(trip.date)}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    {trip.service === 'train' && trip.details && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Train Number</div>
                          <div className="font-semibold">{trip.details.trainNumber || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Journey</div>
                          <div className="font-semibold">
                            {trip.details.from && trip.details.to ? 
                              `${trip.details.from} to ${trip.details.to}` : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Date</div>
                          <div className="font-semibold">{trip.details.departureDate || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Class</div>
                          <div className="font-semibold">{trip.details.class || 'N/A'}</div>
                        </div>
                      </div>
                    )}

                    {trip.service === 'flight' && trip.details && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Flight</div>
                          <div className="font-semibold">{trip.details.flightNumber || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Journey</div>
                          <div className="font-semibold">
                            {trip.details.from && trip.details.to ? 
                              `${trip.details.from} to ${trip.details.to}` : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Date</div>
                          <div className="font-semibold">{trip.details.departureDate || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Class</div>
                          <div className="font-semibold">{trip.details.class || 'N/A'}</div>
                        </div>
                      </div>
                    )}

                    {trip.service === 'hotel' && trip.details && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Hotel ID</div>
                          <div className="font-semibold">{trip.details.hotelId || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Stay Period</div>
                          <div className="font-semibold">
                            {trip.details.checkIn && trip.details.checkOut ? 
                              `${trip.details.checkIn} to ${trip.details.checkOut}` : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Guests</div>
                          <div className="font-semibold">{trip.details.guests || 'N/A'}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t mt-4 pt-4 flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600">Amount Paid</div>
                      <div className="text-xl font-bold text-[#ffa726]">₹{trip.amount.toLocaleString()}</div>
                    </div>
                    <div className="space-x-2 mt-3 md:mt-0">
                      <button className="border border-[#ffa726] text-[#232e3d] px-4 py-2 rounded-md">
                        Download E-Ticket
                      </button>
                      <button className="bg-[#ffa726] hover:bg-[#ff9800] text-white px-4 py-2 rounded-md">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
