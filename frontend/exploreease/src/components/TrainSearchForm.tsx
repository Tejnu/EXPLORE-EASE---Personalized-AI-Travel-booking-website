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
import { format } from 'date-fns';
import { searchTrains, TrainSearchParams } from '@/lib/api';

const TrainSearchForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TrainSearchParams>({
    from: 'Pune (PUNE)',
    to: 'Miraj Jn (MRJ)',
    date: format(new Date(), 'yyyy-MM-dd'),
    quota: 'general',
    class: 'SL',
    passengers: 1
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleQuotaChange = (value: string) => {
    setFormData(prev => ({ ...prev, quota: value }));
  };

  const handlePassengerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, passengers: parseInt(e.target.value) }));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, class: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the API service
      await searchTrains(formData);

      // Redirect to the trains search results page with query params
      const queryParams = new URLSearchParams();
      if (formData.from) queryParams.append('from', formData.from);
      if (formData.to) queryParams.append('to', formData.to);
      if (formData.date) queryParams.append('date', formData.date);
      if (formData.class) queryParams.append('class', formData.class);
      if (formData.quota) queryParams.append('quota', formData.quota);
      if (formData.passengers) queryParams.append('passengers', formData.passengers.toString());

      router.push(`/trains?${queryParams.toString()}`);
    } catch (error) {
      console.error('Error searching for trains:', error);
      // You could show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="train-search-form">
      {/* Quota Selection */}
      <div className="mb-6">
        <RadioGroup
          defaultValue={formData.quota}
          className="flex space-x-4"
          onValueChange={handleQuotaChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general" id="general" />
            <Label htmlFor="general" className="cursor-pointer">General</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tatkal" id="tatkal" />
            <Label htmlFor="tatkal" className="cursor-pointer">Tatkal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ladies" id="ladies" />
            <Label htmlFor="ladies" className="cursor-pointer">Ladies</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Search Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* From */}
        <div className="relative lg:col-span-2">
          <Label htmlFor="train-from" className="block text-sm font-medium text-gray-500 mb-1">From Station</Label>
          <div className="relative">
            <Input
              id="train-from"
              name="from"
              value={formData.from}
              onChange={handleInputChange}
              className="h-14 pl-10 font-medium border-gray-300 focus:border-emerald-500"
            />
            <span className="material-icons absolute left-3 top-4 text-gray-500">location_on</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">New Delhi Railway Station, Delhi</div>
        </div>

        {/* To */}
        <div className="relative lg:col-span-2">
          <Label htmlFor="train-to" className="block text-sm font-medium text-gray-500 mb-1">To Station</Label>
          <div className="relative">
            <Input
              id="train-to"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              className="h-14 pl-10 font-medium border-gray-300 focus:border-emerald-500"
            />
            <span className="material-icons absolute left-3 top-4 text-gray-500">location_on</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Mumbai Central Railway Station, Maharashtra</div>
        </div>

        {/* Journey Date */}
        <div className="relative">
          <Label htmlFor="journey-date" className="block text-sm font-medium text-gray-500 mb-1">Journey Date</Label>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="relative cursor-pointer">
                <Input
                  id="journey-date"
                  value={format(selectedDate, 'd MMM, EEE')}
                  className="h-14 pl-10 font-medium border-gray-300 focus:border-emerald-500"
                  readOnly
                />
                <span className="material-icons absolute left-3 top-4 text-gray-500">calendar_month</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="train-class" className="block text-sm font-medium text-gray-500 mb-1">Travel Class</Label>
          <div className="relative">
            <select
              id="train-class"
              name="class"
              value={formData.class}
              onChange={handleClassChange}
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="SL">Sleeper (SL)</option>
              <option value="3A">AC 3 Tier (3A)</option>
              <option value="2A">AC 2 Tier (2A)</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="CC">Chair Car (CC)</option>
              <option value="EC">Executive Chair Car (EC)</option>
            </select>
            <span className="material-icons absolute left-3 top-2 text-gray-500">airline_seat_recline_normal</span>
          </div>
        </div>

        <div>
          <Label htmlFor="passenger-count" className="block text-sm font-medium text-gray-500 mb-1">Passengers</Label>
          <div className="relative">
            <select
              id="passenger-count"
              value={formData.passengers}
              onChange={handlePassengerChange}
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="1">1 Passenger</option>
              <option value="2">2 Passengers</option>
              <option value="3">3 Passengers</option>
              <option value="4">4 Passengers</option>
              <option value="5">5 Passengers</option>
              <option value="6">6 Passengers</option>
            </select>
            <span className="material-icons absolute left-3 top-2 text-gray-500">people</span>
          </div>
        </div>
      </div>

      {/* Berth Preference */}
      <div className="mt-6">
        <Label className="block text-sm font-medium text-gray-500 mb-2">Berth Preference</Label>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center">
            <input type="checkbox" id="lower" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
            <label htmlFor="lower" className="ml-2 text-sm text-gray-700">Lower</label>
          </div>
          <div className="inline-flex items-center">
            <input type="checkbox" id="middle" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
            <label htmlFor="middle" className="ml-2 text-sm text-gray-700">Middle</label>
          </div>
          <div className="inline-flex items-center">
            <input type="checkbox" id="upper" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
            <label htmlFor="upper" className="ml-2 text-sm text-gray-700">Upper</label>
          </div>
          <div className="inline-flex items-center">
            <input type="checkbox" id="side-lower" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
            <label htmlFor="side-lower" className="ml-2 text-sm text-gray-700">Side Lower</label>
          </div>
          <div className="inline-flex items-center">
            <input type="checkbox" id="side-upper" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
            <label htmlFor="side-upper" className="ml-2 text-sm text-gray-700">Side Upper</label>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="mt-6">
        <div className="flex items-center">
          <input type="checkbox" id="book-only-if-confirm" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
          <label htmlFor="book-only-if-confirm" className="ml-2 text-sm text-gray-700">Book only if confirm berth is available</label>
        </div>
        <div className="flex items-center mt-2">
          <input type="checkbox" id="book-ladies-coach" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
          <label htmlFor="book-ladies-coach" className="ml-2 text-sm text-gray-700">Book in Ladies Coach (if available)</label>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-8 text-center">
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-12 text-lg rounded-md"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Trains'}
        </Button>
      </div>
    </form>
  );
};

export default TrainSearchForm;
