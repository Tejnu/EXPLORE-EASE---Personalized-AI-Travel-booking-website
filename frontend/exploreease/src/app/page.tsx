'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlightSearchForm from '@/components/FlightSearchForm';
import TrainSearchForm from '@/components/TrainSearchForm';
import HotelSearchForm from '@/components/HotelSearchForm';
import OffersSection from '@/components/OffersSection';
import FeaturesSection from '@/components/FeaturesSection';
import AITravelPlanner from '@/components/AITravelPlanner';
import FloatingMenu from '@/components/FloatingMenu';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [showAIPlanner, setShowAIPlanner] = useState(false);

  return (
    <div className="w-full">
      {/* Hero Section with AI Travel Planner */}
      <section className="relative w-full bg-cover bg-center pt-12 pb-32"
        style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=2069&auto=format&fit=crop)' }}>
        <div className="container mx-auto px-4">
          {/* AI Travel Planner Headline */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Plan Your Journey with <span className="text-amber-400">Explore</span><span className="text-white">Ease</span></h1>
            <p className="text-xl text-white mb-8">Experience smarter travel planning with our AI-powered assistant</p>
            <Button
              onClick={() => setShowAIPlanner(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-3 rounded-full"
            >
              <span className="material-icons mr-2">smart_toy</span>
              Start Your AI Journey Planner
            </Button>
          </div>

          {/* Booking Tabs */}
          <div className="search-tabs bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Tabs defaultValue="trains" className="w-full">
              <TabsList className="flex w-full bg-gray-700">
                <TabsTrigger
                  value="trains"
                  className="booking-tab data-[state=active]:booking-tab active flex-grow text-white"
                >
                  <span className="material-icons mr-1">train</span> Trains
                </TabsTrigger>
                <TabsTrigger
                  value="flights"
                  className="booking-tab data-[state=active]:booking-tab flex-grow text-white"
                >
                  <span className="material-icons mr-1">flight</span> Flights
                </TabsTrigger>
                <TabsTrigger
                  value="hotels"
                  className="booking-tab data-[state=active]:booking-tab flex-grow text-white"
                >
                  <span className="material-icons mr-1">hotel</span> Hotels
                </TabsTrigger>
                <TabsTrigger
                  value="buses"
                  className="booking-tab data-[state=active]:booking-tab flex-grow text-white"
                >
                  <span className="material-icons mr-1">directions_bus</span> Buses
                </TabsTrigger>
                <TabsTrigger
                  value="holidays"
                  className="booking-tab data-[state=active]:booking-tab flex-grow text-white"
                >
                  <span className="material-icons mr-1">beach_access</span> Holidays
                </TabsTrigger>
              </TabsList>

              {/* Train Search Form */}
              <TabsContent value="trains" className="p-4">
                <TrainSearchForm />
              </TabsContent>

              {/* Flight Search Form */}
              <TabsContent value="flights" className="p-4">
                <FlightSearchForm />
              </TabsContent>

              {/* Hotel Search Form */}
              <TabsContent value="hotels" className="p-4">
                <HotelSearchForm />
              </TabsContent>

              {/* Bus Search Form */}
              <TabsContent value="buses" className="p-4">
                <div className="text-center py-8">
                  <p className="text-gray-300">Bus search form will be added here</p>
                </div>
              </TabsContent>

              {/* Holiday Packages */}
              <TabsContent value="holidays" className="p-4">
                <div className="text-center py-8">
                  <p className="text-gray-300">Holiday packages search will be added here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Why Choose ExploreEase */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-200">Why Choose <span className="text-amber-500">Explore</span>Ease</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-amber-500 text-3xl">smart_toy</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-200">AI-Powered Planning</h3>
              <p className="text-gray-400">Get personalized itineraries and travel recommendations from our AI assistant.</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-amber-500 text-3xl">confirmation_number</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-200">Confirmed Tickets</h3>
              <p className="text-gray-400">Increase your chances of getting confirmed train and flight tickets with our prediction algorithm.</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-amber-500 text-3xl">savings</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-200">Best Deals</h3>
              <p className="text-gray-400">Enjoy exclusive discounts and offers on trains, flights, hotels, and holiday packages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <OffersSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Floating Menu */}
      <FloatingMenu />

      {/* AI Travel Planner Modal - Show when showAIPlanner is true */}
      {showAIPlanner && <AITravelPlanner onClose={() => setShowAIPlanner(false)} />}
    </div>
  );
}
