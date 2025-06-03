'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CITY_OPTIONS = [
  "kochi","trivandrum","pune","mumbai","chennai","goa","delhi","kolkata","bangalore","hyderabad","lucknow"
];
const AMENITIES = [
  "5-star hotel","4-star hotel","3-star hotel","Apartment","Villa","House","Free breakfast","Breakfast",
  "Free Wi-Fi","Wi-Fi","Free parking","Paid parking","Pool","Hot tub","Air conditioning","Fitness center",
  "Spa","Bar","Restaurant","Room service","Airport shuttle","Full-service laundry","Kid-friendly","Pet-friendly",
  "Kitchen","Fireplace","Beach access","Elevator","Accessible","Smoke-free"
];

function formatStars(rating: number) {
  const r = Math.round(rating);
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

export default function HotelsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [form, setForm] = useState({
    city: "kochi",
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    guests: 2,
    minPrice: "",
    maxPrice: "",
    rating: "",
    features: [] as string[],
  });

  const fetchHotels = async (params = form) => {
    setLoading(true);
    const q = new URLSearchParams();
    q.set('city', params.city.toLowerCase());
    if (params.minPrice) q.set('minPrice', params.minPrice);
    if (params.maxPrice) q.set('maxPrice', params.maxPrice);
    if (params.rating) q.set('minRating', params.rating);
    params.features.forEach(f => q.append('feature', f.toLowerCase()));
    const res = await fetch(`/api/booking/hotel?${q.toString()}`);
    const data = await res.json();
    setHotels(data.hotels || []);
    setLoading(false);
  };

  useEffect(() => { fetchHotels(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleAmenities = (feature: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHotels();
  };

  const handleSelectHotel = (hotel: any) => {
    if (selectedHotel?.id === hotel.id) {
      setSelectedHotel(null);
    } else {
      setSelectedHotel(hotel);
    }
  };

  const handleBookHotel = (hotel: any) => {
    // Navigate to booking page with all required parameters
    router.push(`/booking?service=hotel&id=${hotel.id}&checkIn=${form.checkIn}&checkOut=${form.checkOut}&guests=${form.guests}&amount=${hotel.price}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] py-10">
      <form
        className="mx-auto mb-10 max-w-4xl bg-white rounded-2xl shadow-lg px-8 py-7 flex flex-col gap-5"
        style={{ border: "none", position: "relative", top: "0" }}
        onSubmit={handleSubmit}
      >
        <div className="mb-2 text-3xl font-bold text-[#232e3d]">Hotel Search</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#232e3d] mb-1">City</label>
            <select name="city" value={form.city} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-3 bg-[#f3f6fa] text-[#232e3d] font-medium">
              {CITY_OPTIONS.map(city =>
                <option value={city} key={city}>{city.charAt(0).toUpperCase() + city.slice(1)}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#232e3d] mb-1">Check-In</label>
            <input 
              type="date" 
              name="checkIn" 
              value={form.checkIn} 
              onChange={handleChange} 
              className="border rounded-lg px-3 py-3 w-full bg-[#f3f6fa] text-[#232e3d]" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#232e3d] mb-1">Check-Out</label>
            <input 
              type="date" 
              name="checkOut" 
              value={form.checkOut} 
              min={form.checkIn}
              onChange={handleChange} 
              className="border rounded-lg px-3 py-3 w-full bg-[#f3f6fa] text-[#232e3d]" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#232e3d] mb-1">Guests</label>
            <input 
              type="number" 
              name="guests" 
              value={form.guests} 
              min={1}
              onChange={handleChange} 
              className="border rounded-lg px-3 py-3 w-full bg-[#f3f6fa] text-[#232e3d]" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#232e3d] mb-1">Min Price</label>
            <input type="number" name="minPrice" value={form.minPrice} min={0}
              onChange={handleChange} className="border rounded-lg px-3 py-3 w-full bg-[#f3f6fa] text-[#232e3d]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#232e3d] mb-1">Max Price</label>
            <input type="number" name="maxPrice" value={form.maxPrice} min={0}
              onChange={handleChange} className="border rounded-lg px-3 py-3 w-full bg-[#f3f6fa] text-[#232e3d]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#232e3d] mb-1">Min Rating</label>
            <input type="number" name="rating" value={form.rating} min={0} max={5} step={0.1}
              onChange={handleChange} className="border rounded-lg px-3 py-3 w-full bg-[#f3f6fa] text-[#232e3d]" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {AMENITIES.map(feature => (
            <label key={feature} className="text-xs flex items-center gap-1 mr-2 text-[#232e3d]">
              <input
                type="checkbox"
                className="accent-[#ffa726]"
                checked={form.features.includes(feature)}
                onChange={() => handleAmenities(feature)}
              /> {feature}
            </label>
          ))}
        </div>
        <div>
          <button
            type="submit"
            className="bg-[#ffa726] hover:bg-orange-500 text-white font-semibold px-10 py-3 rounded-lg text-lg w-full md:w-auto"
          >
            Search
          </button>
        </div>
      </form>
      <div className="container mx-auto px-4 pt-2">
        {loading && <div className="text-center text-[#ffa726] py-8 font-bold text-lg">Loading hotels...</div>}
        {!loading && hotels.length === 0 && (
          <div className="bg-[#fff3da] text-[#232e3d] p-6 rounded-lg text-center mt-8 shadow">
            <div className="font-semibold text-lg mb-2">No hotels found</div>
            <div>Try changing city, price, rating, or amenities.</div>
          </div>
        )}
        {!loading && hotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {hotels.map((hotel: any) => (
              <div 
                key={hotel.id} 
                className={`bg-white ${selectedHotel?.id === hotel.id ? 'border-2' : 'border'} border-[#ffa726] rounded-xl shadow flex flex-col h-full cursor-pointer transition-all hover:shadow-lg`}
                onClick={() => handleSelectHotel(hotel)}
              >
                <div className="p-6 flex flex-col gap-2 flex-grow">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-[#232e3d]">{hotel.name}</h2>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-[#ffa726]">{hotel.rating}</span>
                      <span className="text-[#ffa726]">{formatStars(hotel.rating)}</span>
                    </div>
                  </div>
                  <div className="text-[#ffa726] font-medium">{hotel.city.charAt(0).toUpperCase() + hotel.city.slice(1)}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hotel.features && hotel.features.length > 0 &&
                      hotel.features.slice(0, 8).map((feat: string, i: number) => (
                        <span key={i} className="bg-[#fff3da] text-[#232e3d] text-xs px-2 py-1 rounded">
                          {feat}
                        </span>
                      ))
                    }
                  </div>
                </div>
                <div className="flex justify-between items-end px-6 pb-5 mt-auto">
                  <div>
                    <div className="text-[#232e3d] text-sm">From</div>
                    <div className="text-2xl font-extrabold text-[#ffa726]">₹{hotel.price}</div>
                    <div className="text-[#232e3d] text-xs">per night</div>
                  </div>
                  <button
                    className="bg-[#ffa726] hover:bg-orange-500 text-white px-6 py-2 rounded-md font-semibold transition"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the card click
                      handleBookHotel(hotel);
                    }}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed bottom bar when a hotel is selected */}
      {selectedHotel && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <div className="font-semibold">Selected Hotel: {selectedHotel.name}</div>
              <div className="text-gray-600 text-sm">
                {form.checkIn} to {form.checkOut} | {form.guests} Guests
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold text-[#ffa726]">₹{selectedHotel.price}</div>
              <button
                onClick={() => handleBookHotel(selectedHotel)}
                className="bg-[#ffa726] hover:bg-[#ff9800] text-white px-8 py-2 rounded-lg transition"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
