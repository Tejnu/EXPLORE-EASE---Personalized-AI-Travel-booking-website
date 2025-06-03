'use client';
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CITY_OPTIONS = [
  "mumbai", "pune", "delhi", "goa", "kochi", "trivandrum", "bangalore", "chennai", "hyderabad", "lucknow", "kolkata", "bhubaneswar", "kanpur", "chandigarh"
];
const AMENITIES = [
  "5-star hotel", "4-star hotel", "3-star hotel", "2-star hotel", "Apartment", "Villa", "House",
  "Free breakfast", "Breakfast", "Free Wi-Fi", "Wi-Fi", "Free parking", "Paid parking", "Pool",
  "Hot tub", "Air conditioning", "Fitness center", "Spa", "Bar", "Restaurant", "Room service",
  "Airport shuttle", "Full-service laundry", "Kid-friendly", "Pet-friendly", "Kitchen", "Fireplace",
  "Beach access", "Elevator", "Accessible", "Smoke-free"
];

interface HotelSearchFormData {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  features: string[];
}

const today = new Date();
const tomorrow = addDays(today, 1);

const HotelSearchForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HotelSearchFormData>({
    city: 'mumbai',
    checkIn: format(today, 'yyyy-MM-dd'),
    checkOut: format(tomorrow, 'yyyy-MM-dd'),
    guests: 2,
    minPrice: '',
    maxPrice: '',
    minRating: '',
    features: []
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Here you would call searchHotels(formData);
    console.log("Searching hotels with:", formData);
    setLoading(false);
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-lg mb-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Label htmlFor="city" className="mb-1">City</Label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="h-14 pl-3 font-medium border-gray-300 focus:border-ee-orange-500 rounded-md w-full"
          >
            {CITY_OPTIONS.map(cityOpt => (
              <option value={cityOpt} key={cityOpt}>{cityOpt.charAt(0).toUpperCase() + cityOpt.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="checkIn" className="mb-1">Check-in</Label>
          <Input
            type="date"
            id="checkIn"
            name="checkIn"
            value={formData.checkIn}
            min={format(today, 'yyyy-MM-dd')}
            onChange={handleInputChange}
            className="h-14 pl-3 font-medium border-gray-300 focus:border-ee-orange-500"
          />
        </div>
        <div>
          <Label htmlFor="checkOut" className="mb-1">Check-out</Label>
          <Input
            type="date"
            id="checkOut"
            name="checkOut"
            value={formData.checkOut}
            min={formData.checkIn}
            onChange={handleInputChange}
            className="h-14 pl-3 font-medium border-gray-300 focus:border-ee-orange-500"
          />
        </div>
        <div>
          <Label htmlFor="guests" className="mb-1">Guests</Label>
          <Input
            type="number"
            id="guests"
            name="guests"
            min={1}
            max={20}
            value={formData.guests}
            onChange={handleInputChange}
            className="h-14 pl-3 font-medium border-gray-300 focus:border-ee-orange-500"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 items-end">
        <div>
          <Label htmlFor="minPrice">Min price</Label>
          <Input
            id="minPrice"
            name="minPrice"
            type="number"
            min={0}
            value={formData.minPrice}
            onChange={handleInputChange}
            className="w-24"
          />
        </div>
        <div>
          <Label htmlFor="maxPrice">Max price</Label>
          <Input
            id="maxPrice"
            name="maxPrice"
            type="number"
            min={0}
            value={formData.maxPrice}
            onChange={handleInputChange}
            className="w-24"
          />
        </div>
        <div>
          <Label htmlFor="minRating">Min rating</Label>
          <Input
            id="minRating"
            name="minRating"
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={formData.minRating}
            onChange={handleInputChange}
            className="w-20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Label className="w-full">Amenities</Label>
          {AMENITIES.map(feature => (
            <label key={feature} className="inline-flex items-center text-sm mr-2">
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="mr-1 accent-blue-500"
              />
              {feature}
            </label>
          ))}
        </div>
        <Button
          type="submit"
          className="h-11 px-7 bg-ee-orange-600 hover:bg-ee-orange-700 text-white rounded-md ml-auto"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
};

export default HotelSearchForm;
