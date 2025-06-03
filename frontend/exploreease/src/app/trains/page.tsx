'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TrainSearchForm from '@/components/TrainSearchForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { searchTrains } from '@/lib/api';

const CLASS_NAMES: Record<string, string> = {
  'SL': 'Sleeper',
  '3A': 'AC 3 Tier',
  '2A': 'AC 2 Tier',
  '1A': 'AC First Class',
  'CC': 'Chair Car',
  'EC': 'Exec. Chair Car'
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const weekday = date.toLocaleString('default', { weekday: 'short' });
  return `${day} ${month}, ${weekday}`;
};

interface Train {
  id: number;
  number: string;
  name: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: string[];
  availability: Record<string, { status: string; number: number; prediction: string }>;
  fare: Record<string, number>;
}

const TrainsLoading = () => (
  <div className="text-center py-10">
    <div className="animate-spin w-10 h-10 border-4 border-[#ffa726] border-t-transparent rounded-full mx-auto mb-4"></div>
    <p className="text-[#232e3d]">Loading trains search...</p>
  </div>
);

const TrainsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>('');

  const from = searchParams.get('from') || 'PUNE';
  const to = searchParams.get('to') || 'MRJ';
  const date = searchParams.get('date') || '2025-05-15';

  useEffect(() => {
    const fetchTrains = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          from,
          to,
          date,
          class: searchParams.get('class') || undefined,
          quota: searchParams.get('quota') || undefined,
          passengers: searchParams.get('passengers') ? parseInt(searchParams.get('passengers')!) : undefined
        };
        const response = await searchTrains(params);
        setTrains(response.trains);
      } catch (err) {
        setError('Failed to load trains. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrains();
  }, [from, to, date, searchParams]);

  const handleSelectClass = (train: Train, className: string) => {
    const selectionId = `${train.id}-${className}`;
    if (selectedClass === selectionId) {
      setSelectedClass('');
      setSelectedTrain(null);
      setSelectedClassName('');
    } else {
      setSelectedClass(selectionId);
      setSelectedTrain(train);
      setSelectedClassName(className);
    }
  };

  const handleBookTrain = (train: Train, className: string) => {
    const fare = train.fare[className];
    router.push(
      `/booking?service=train&id=${train.id}&from=${train.from}&to=${train.to}&date=${date}&class=${className}&amount=${fare}`
    );
  };

  return (
    <div className="bg-[#f5f6fa] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#232e3d] mb-6">IRCTC Train Ticket Booking</h1>
        <div className="mb-8">
          <TrainSearchForm />
        </div>
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#232e3d]">
              {from} to {to} <span className="text-gray-500 text-base font-normal">| {formatDate(date)}</span>
            </h2>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Sort by:</span>
              <select className="border rounded-md px-2 py-1">
                <option>Departure</option>
                <option>Duration</option>
                <option>Price</option>
              </select>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm mb-4 flex flex-wrap gap-4">
            <div className="text-sm text-[#232e3d] font-medium">Confirmation prediction:</div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
              <span className="text-sm text-gray-600">High chances</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
              <span className="text-sm text-gray-600">Medium chances</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
              <span className="text-sm text-gray-600">Low chances</span>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 p-4 rounded-lg mb-4 text-red-700">{error}</div>
          )}
          {loading && <TrainsLoading />}
          {!loading && trains.length === 0 && !error && (
            <div className="bg-[#fff3da] p-6 rounded-lg text-center">
              <p className="text-lg font-semibold text-yellow-700 mb-2">No trains found</p>
              <p className="text-gray-600">Try adjusting your search criteria or select a different date.</p>
            </div>
          )}
          {!loading && trains.length > 0 && (
            <div className="space-y-4">
              {trains.map((train) => (
                <Card key={train.id} className="train-card bg-white shadow-md">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-bold text-[#232e3d]">{train.number} - {train.name}</h3>
                          <span className="ml-2 text-xs bg-[#fff3da] text-[#ffa726] px-2 py-0.5 rounded">Runs Daily</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{train.fromName} to {train.toName} | {formatDate(date)}</div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2 md:mt-0">
                        <span className="font-medium">Avg. Delay:</span> 15 mins
                      </div>
                    </div>
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between mb-6">
                      <div className="w-1/3 md:w-auto">
                        <div className="text-2xl font-bold text-[#232e3d]">{train.departureTime}</div>
                        <div className="text-sm text-gray-600">{train.fromName} ({train.from})</div>
                      </div>
                      <div className="w-1/3 md:w-auto flex flex-col items-center">
                        <div className="text-sm text-gray-500">{train.duration}</div>
                        <div className="relative w-24 md:w-32 h-0.5 bg-gray-300 my-1">
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full"></div>
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-500">Direct</div>
                      </div>
                      <div className="w-1/3 md:w-auto text-right">
                        <div className="text-2xl font-bold text-[#232e3d]">{train.arrivalTime}</div>
                        <div className="text-sm text-gray-600">{train.toName} ({train.to})</div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="font-medium text-[#232e3d] mb-2">Available Classes:</div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {Object.entries(train.availability).map(([className, avail]) => (
                          <div
                            key={className}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedClass === `${train.id}-${className}` ? 'border-[#ffa726] bg-[#fff3da]' : 'hover:border-[#ffa726]'}`}
                            onClick={() => handleSelectClass(train, className)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{CLASS_NAMES[className]}</div>
                                <div className="text-2xl font-bold text-[#ffa726] mt-1">₹{train.fare[className]}</div>
                              </div>
                              <div className={`px-2 py-1 rounded text-xs font-medium
                                ${avail.status === 'AVBL' ? 'bg-green-100 text-green-800' :
                                  avail.status === 'RAC' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'}`}
                              >
                                {avail.status === 'AVBL' ? 'Available' :
                                 avail.status === 'RAC' ? 'RAC' :
                                 `WL ${avail.number}`}
                              </div>
                            </div>
                            <div className="mt-2 text-sm">
                              <div className="flex items-center">
                                <span className={`inline-block w-2 h-2 rounded-full mr-1
                                  ${avail.prediction === 'high' ? 'bg-green-500' :
                                    avail.prediction === 'medium' ? 'bg-yellow-500' :
                                    'bg-red-500'}`}
                                ></span>
                                <span className="text-gray-600">Confirmation prediction: {avail.prediction}</span>
                              </div>
                            </div>
                            {selectedClass === `${train.id}-${className}` && (
                              <button
                                className="w-full mt-3 bg-[#ffa726] hover:bg-[#ff9800] text-white py-2 rounded-md font-medium"
                                onClick={() => handleBookTrain(train, className)}
                              >
                                Book Now
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        {/* Fixed bottom bar when class is selected */}
        {selectedTrain && selectedClassName && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-10">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <div className="font-semibold">
                  {selectedTrain.name} ({selectedTrain.number}) - {CLASS_NAMES[selectedClassName]}
                </div>
                <div className="text-gray-600 text-sm">
                  {selectedTrain.fromName} to {selectedTrain.toName} | {formatDate(date)}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-[#ffa726]">₹{selectedTrain.fare[selectedClassName]}</div>
                <button
                  onClick={() => handleBookTrain(selectedTrain, selectedClassName)}
                  className="bg-[#ffa726] hover:bg-[#ff9800] text-white px-8 py-2 rounded-lg transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TrainsPage = () => (
  <Suspense fallback={<TrainsLoading />}>
    <TrainsContent />
  </Suspense>
);

export default TrainsPage;
