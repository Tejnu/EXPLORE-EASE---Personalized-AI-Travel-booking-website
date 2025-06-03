'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { searchFlights, FlightSearchParams } from '@/lib/api';

interface Traveler {
  adults: number;
  children: number;
  infants: number;
}

type TripType = 'one-way' | 'round-trip' | 'multi-city';

const FlightSearchForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tripType, setTripType] = useState<TripType>('one-way');

  const [formData, setFormData] = useState<FlightSearchParams>({
    from: 'Delhi',
    to: 'Mumbai',
    date: format(new Date(), 'yyyy-MM-dd'),
    tripType: 'one-way',
    adults: 1,
    children: 0,
    infants: 0,
    class: 'Economy'
  });

  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [showTravelersDialog, setShowTravelersDialog] = useState(false);
  const [travelers, setTravelers] = useState<Traveler>({
    adults: 1,
    children: 0,
    infants: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTripTypeChange = (value: string) => {
    const newTripType = value as TripType;
    setTripType(newTripType);
    setFormData(prev => ({
      ...prev,
      tripType: newTripType,
      ...(newTripType === 'one-way' ? { returnDate: undefined } : {})
    }));
  };

  const handleDepartureDateSelect = (date: Date | undefined) => {
    if (date) {
      setDepartureDate(date);
      setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleReturnDateSelect = (date: Date | undefined) => {
    if (date) {
      setReturnDate(date);
      setFormData(prev => ({ ...prev, returnDate: format(date, 'yyyy-MM-dd') }));
    }
  };

  const updateTravelers = (type: keyof Traveler, value: number) => {
    if (value < 0) return;

    const newTravelers = { ...travelers, [type]: value };
    const total = newTravelers.adults + newTravelers.children + newTravelers.infants;

    if (total > 9) return;

    if (type === 'infants' && value > newTravelers.adults) return;

    if (type === 'adults' && value === 0) return;

    setTravelers(newTravelers);
    setFormData(prev => ({
      ...prev,
      adults: newTravelers.adults,
      children: newTravelers.children,
      infants: newTravelers.infants
    }));
  };

  const getTravelersText = () => {
    const total = travelers.adults + travelers.children + travelers.infants;
    const text = total === 1 ? '1 Traveller' : `${total} Travellers`;
    return `${text}, ${formData.class}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await searchFlights(formData);

      const queryParams = new URLSearchParams();
      if (formData.from) queryParams.append('from', formData.from);
      if (formData.to) queryParams.append('to', formData.to);
      if (formData.date) queryParams.append('date', formData.date);
      if (formData.returnDate) queryParams.append('returnDate', formData.returnDate);
      if (formData.tripType) queryParams.append('tripType', formData.tripType);
      if (formData.adults) queryParams.append('adults', formData.adults.toString());
      if (formData.children) queryParams.append('children', formData.children.toString());
      if (formData.infants) queryParams.append('infants', formData.infants.toString());
      if (formData.class) queryParams.append('class', formData.class);

      router.push(`/flights?${queryParams.toString()}`);
    } catch (error) {
      console.error('Error searching for flights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flight-search-form">
      <div className="mb-6">
        <RadioGroup
          value={tripType}
          onValueChange={handleTripTypeChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="one-way" id="one-way" />
            <Label htmlFor="one-way" className="cursor-pointer">One Way</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="round-trip" id="round-trip" />
            <Label htmlFor="round-trip" className="cursor-pointer">Round Trip</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multi-city" id="multi-city" />
            <Label htmlFor="multi-city" className="cursor-pointer">Multi City</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Label htmlFor="from" className="block text-sm font-medium text-ee-ash-500 mb-1">From</Label>
          <div className="relative">
            <Input
              id="from"
              name="from"
              value={formData.from}
              onChange={handleInputChange}
              className="h-14 pl-10 font-medium border-gray-300 focus:border-ee-orange-500"
            />
            <span className="material-icons absolute left-3 top-4 text-ee-ash-600">flight_takeoff</span>
          </div>
          <div className="text-xs text-ee-ash-500 mt-1">DXB, Dubai International Airport United Arab Emirates</div>
        </div>

        <div className="relative">
          <Label htmlFor="to" className="block text-sm font-medium text-ee-ash-500 mb-1">To</Label>
          <div className="relative">
            <Input
              id="to"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              className="h-14 pl-10 font-medium border-gray-300 focus:border-ee-orange-500"
            />
            <span className="material-icons absolute left-3 top-4 text-ee-ash-600">flight_land</span>
          </div>
          <div className="text-xs text-ee-ash-500 mt-1">NYC, All airports-NY United States</div>
        </div>

        <div className="relative">
          <Label htmlFor="departure" className="block text-sm font-medium text-ee-ash-500 mb-1">Departure</Label>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="relative cursor-pointer">
                <Input
                  id="departure"
                  value={format(departureDate, 'd MMM, EEE')}
                  className="h-14 pl-10 font-medium border-gray-300 focus:border-ee-orange-500"
                  readOnly
                />
                <span className="material-icons absolute left-3 top-4 text-ee-ash-600">calendar_month</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={handleDepartureDateSelect}
                className="rounded-md border"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="relative">
          <Label htmlFor="return" className="block text-sm font-medium text-ee-ash-500 mb-1">Return</Label>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="relative">
                <Input
                  id="return"
                  placeholder="Tap to add a return date"
                  value={returnDate ? format(returnDate, 'd MMM, EEE') : ''}
                  className={`h-14 pl-10 font-medium border-gray-300 focus:border-ee-orange-500 ${tripType === 'one-way' ? 'bg-ee-ash-100' : ''}`}
                  readOnly
                  disabled={tripType === 'one-way'}
                />
                <span className={`material-icons absolute left-3 top-4 ${tripType === 'one-way' ? 'text-ee-ash-400' : 'text-ee-ash-600'}`}>calendar_month</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-0" align="start">
              {tripType !== 'one-way' && (
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={handleReturnDateSelect}
                  className="rounded-md border"
                  disabled={(date) => date < departureDate}
                />
              )}
            </HoverCardContent>
          </HoverCard>
          <div className="text-xs text-ee-ash-500 mt-1">For bigger discounts</div>
        </div>

        <div className="relative">
          <Label htmlFor="travelers" className="block text-sm font-medium text-ee-ash-500 mb-1">Travellers & Class</Label>
          <Dialog open={showTravelersDialog} onOpenChange={setShowTravelersDialog}>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer">
                <Input
                  id="travelers"
                  value={getTravelersText()}
                  className="h-14 pl-10 font-medium border-gray-300 focus:border-ee-orange-500"
                  readOnly
                />
                <span className="material-icons absolute left-3 top-4 text-ee-ash-600">people</span>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-4">Travellers & Class</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Adults</div>
                      <div className="text-sm text-ee-ash-500">12+ years</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border border-ee-ash-300 flex items-center justify-center text-lg"
                        onClick={() => updateTravelers('adults', travelers.adults - 1)}
                      >
                        -
                      </button>
                      <span className="w-6 text-center">{travelers.adults}</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border border-ee-ash-300 flex items-center justify-center text-lg"
                        onClick={() => updateTravelers('adults', travelers.adults + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Children</div>
                      <div className="text-sm text-ee-ash-500">2-12 years</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border border-ee-ash-300 flex items-center justify-center text-lg"
                        onClick={() => updateTravelers('children', travelers.children - 1)}
                      >
                        -
                      </button>
                      <span className="w-6 text-center">{travelers.children}</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border border-ee-ash-300 flex items-center justify-center text-lg"
                        onClick={() => updateTravelers('children', travelers.children + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Infants</div>
                      <div className="text-sm text-ee-ash-500">Below 2 years</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border border-ee-ash-300 flex items-center justify-center text-lg"
                        onClick={() => updateTravelers('infants', travelers.infants - 1)}
                      >
                        -
                      </button>
                      <span className="w-6 text-center">{travelers.infants}</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border border-ee-ash-300 flex items-center justify-center text-lg"
                        onClick={() => updateTravelers('infants', travelers.infants + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-medium mb-2 block">Travel Class</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={`border p-2 rounded cursor-pointer ${formData.class === 'Economy' ? 'border-ee-orange-500 bg-ee-orange-100' : 'border-ee-ash-200'}`}
                      onClick={() => setFormData(prev => ({ ...prev, class: 'Economy' }))}
                    >
                      Economy
                    </div>
                    <div
                      className={`border p-2 rounded cursor-pointer ${formData.class === 'Premium Economy' ? 'border-ee-orange-500 bg-ee-orange-100' : 'border-ee-ash-200'}`}
                      onClick={() => setFormData(prev => ({ ...prev, class: 'Premium Economy' }))}
                    >
                      Premium Economy
                    </div>
                    <div
                      className={`border p-2 rounded cursor-pointer ${formData.class === 'Business' ? 'border-ee-orange-500 bg-ee-orange-100' : 'border-ee-ash-200'}`}
                      onClick={() => setFormData(prev => ({ ...prev, class: 'Business' }))}
                    >
                      Business
                    </div>
                    <div
                      className={`border p-2 rounded cursor-pointer ${formData.class === 'First Class' ? 'border-ee-orange-500 bg-ee-orange-100' : 'border-ee-ash-200'}`}
                      onClick={() => setFormData(prev => ({ ...prev, class: 'First Class' }))}
                    >
                      First Class
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="button"
                    className="w-full bg-ee-orange-500 hover:bg-ee-orange-600 text-white"
                    onClick={() => setShowTravelersDialog(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-4 mb-6">
        <div className="text-xs text-ee-ash-600">Trending Searches:</div>
        <div className="flex mt-1 flex-wrap gap-2">
          <span className="text-xs bg-ee-ash-100 py-1 px-2 rounded-full text-ee-orange-600">Dubai - Hyderabad</span>
          <span className="text-xs bg-ee-ash-100 py-1 px-2 rounded-full text-ee-orange-600">Dubai - Mumbai</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          type="submit"
          className="bg-ee-orange-500 hover:bg-ee-orange-600 text-white py-2 px-12 text-lg rounded-md"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </form>
  );
};

export default FlightSearchForm;
