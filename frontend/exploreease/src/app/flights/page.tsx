'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FlightSearchForm from '@/components/FlightSearchForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { searchFlights } from '@/lib/api';
import Link from 'next/link';
import BookNowButton from '@/components/BookNowButton';

const FlightsPageLoading: React.FC = () => (
  <div className="bg-gray-50 min-h-screen py-8">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-mmt-accent mb-6">Flight Search Results</h1>
      <div className="mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center py-10">
        <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-teal-500">Loading flights...</p>
      </div>
    </div>
  </div>
);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const weekday = date.toLocaleString('default', { weekday: 'short' });
  return `${day} ${month}, ${weekday}`;
};

export interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  price: number;
  class: string;
  logo?: string;
  // Additional properties from CSV can be added here if needed
}

const FlightsPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const from = searchParams.get('from') || 'Delhi';
  const to = searchParams.get('to') || 'Mumbai';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const flightClass = searchParams.get('class') || 'Economy';

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          from,
          to,
          date,
          class: flightClass
        };
        const response = await searchFlights(params);
        setFlights(response.flights || []);
      } catch (err) {
        setError('Failed to load flights. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [from, to, date, flightClass, searchParams]);

  const handleFlightSelect = (flight: Flight) => {
    if (selectedFlight?.id === flight.id) {
      setSelectedFlight(null); // Toggle selection off if already selected
    } else {
      setSelectedFlight(flight); // Select the flight
    }
  };

  const handleBookNow = () => {
    if (!selectedFlight) {
      alert('Please select a flight first');
      return;
    }
    
    // Redirect to the booking page with all necessary parameters
    router.push(
      `/booking?service=flight&id=${selectedFlight.id}&from=${from}&to=${to}&date=${date}&class=${selectedFlight.class}&amount=${selectedFlight.price}`
    );
  };

  return (
    <div className="bg-[#f5f6fa] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#232e3d] mb-6">Flight Search Results</h1>
        <div className="mb-8">
          <FlightSearchForm />
        </div>
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#232e3d]">
              {from} to {to} <span className="text-gray-500 text-base font-normal">| {formatDate(date)}</span>
            </h2>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Sort by:</span>
              <select className="border rounded-md px-2 py-1">
                <option>Price - Low to High</option>
                <option>Duration - Shortest</option>
                <option>Departure - Earliest</option>
                <option>Arrival - Earliest</option>
              </select>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 p-4 rounded-lg mb-4 text-red-700">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <div className="animate-spin w-10 h-10 border-4 border-[#ffa726] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-[#ffa726]">Searching for flights...</p>
            </div>
          )}
          {!loading && flights.length === 0 && !error && (
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <p className="text-lg font-semibold text-yellow-700 mb-2">No flights found</p>
              <p className="text-gray-600">Try adjusting your search criteria or select a different date.</p>
            </div>
          )}
          {!loading && flights.length > 0 && (
            <>
              <div className="space-y-4">
                {flights.map((flight) => (
                  <Card 
                    key={flight.id} 
                    className={`flight-card cursor-pointer ${selectedFlight?.id === flight.id ? 'border-[#ffa726] border-2' : ''}`}
                    onClick={() => handleFlightSelect(flight)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start md:items-center mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 mr-3">
                            {flight.logo && (
                              <img src={flight.logo} alt={flight.airline} className="w-full h-full object-contain" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold">{flight.airline}</h3>
                            <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{flight.class}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap md:flex-nowrap items-center justify-between mb-4">
                        <div className="w-1/3 md:w-auto">
                          <div className="text-xl md:text-2xl font-bold text-gray-800">{flight.departureTime}</div>
                          <div className="text-sm text-gray-600">{from}</div>
                          <div className="text-xs text-gray-500">{formatDate(date)}</div>
                        </div>
                        <div className="w-1/3 md:w-auto flex flex-col items-center">
                          <div className="text-sm text-gray-500">{flight.duration}</div>
                          <div className="text-xs text-gray-500">
                            {flight.stops?.toLowerCase().includes('non') ? 'Non-stop' : flight.stops}
                          </div>
                        </div>
                        <div className="w-1/3 md:w-auto text-right">
                          <div className="text-xl md:text-2xl font-bold text-gray-800">{flight.arrivalTime}</div>
                          <div className="text-sm text-gray-600">{to}</div>
                          <div className="text-xs text-gray-500">{formatDate(date)}</div>
                        </div>
                      </div>
                      <div className="border-t pt-4 flex flex-col md:flex-row justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Total Fare</div>
                          <div className="text-2xl font-bold text-[#ffa726]">₹{flight.price}</div>
                          <div className="text-xs text-gray-500">per person</div>
                        </div>
                        <div className="mt-4 md:mt-0 w-full md:w-auto">
                          <div className="text-xs text-center md:text-right text-gray-500 mt-1">
                            <Link href="#" className="text-[#ffa726] hover:underline">View Fare Details</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Bottom fixed booking bar that appears when a flight is selected */}
              {selectedFlight && (
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-10">
                  <div className="container mx-auto flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Selected Flight: {selectedFlight.airline} {selectedFlight.flightNumber}</div>
                      <div className="text-gray-600 text-sm">{from} to {to} | {formatDate(date)}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-xl font-bold text-[#ffa726]">₹{selectedFlight.price}</div>
                      <Button
                        onClick={handleBookNow}
                        className="bg-[#ffa726] hover:bg-[#ff9800] text-white px-8 py-2 rounded-lg transition"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const FlightsPage: React.FC = () => (
  <Suspense fallback={<FlightsPageLoading />}>
    <FlightsPageContent />
  </Suspense>
);

export default FlightsPage;
