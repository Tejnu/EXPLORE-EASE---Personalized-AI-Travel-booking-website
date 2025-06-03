'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AITravelPlanner from '@/components/AITravelPlanner';

const AITravelPlannerPage = () => {
  const [showAIPlanner, setShowAIPlanner] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-emerald-700 mb-6">AI Travel Planner</h1>

        <div className="max-w-4xl mx-auto">
          {/* AI Planner Introduction */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="material-icons text-emerald-600 text-4xl">smart_toy</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Your Personal AI Travel Assistant</h2>
            <p className="text-gray-600 text-center mb-6">
              Planning a trip has never been easier. Our AI Travel Planner helps you create personalized
              itineraries, find the best travel options, and get recommendations tailored to your preferences.
            </p>

            <div className="text-center mb-8">
              <Button
                onClick={() => setShowAIPlanner(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-6 py-3 rounded-full"
              >
                <span className="material-icons mr-2">chat</span>
                Start Planning Your Trip
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <span className="material-icons text-emerald-600">explore</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Destination Ideas</h3>
                <p className="text-sm text-gray-600">Get personalized destination recommendations based on your interests, budget, and travel style.</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <span className="material-icons text-emerald-600">map</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Custom Itineraries</h3>
                <p className="text-sm text-gray-600">Create detailed day-by-day travel plans with attractions, activities, and dining options.</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <span className="material-icons text-emerald-600">payments</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Budget Planning</h3>
                <p className="text-sm text-gray-600">Get cost estimates and budget-friendly alternatives for your entire trip.</p>
              </div>
            </div>
          </div>

          {/* Sample Itineraries */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6">Sample AI-Generated Itineraries</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <div className="h-48 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                  <img
                    src="https://images.unsplash.com/photo-1580741569354-08feedd159f9?q=80&w=2071&auto=format&fit=crop"
                    alt="Goa Beaches"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Goa Beach Getaway</h3>
                    <p className="text-sm">4 Days • Budget-friendly</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-3">
                    Perfect for beach lovers looking for a mix of relaxation and nightlife. Includes visits to popular beaches, water activities, and local dining spots.
                  </div>
                  <Button
                    onClick={() => setShowAIPlanner(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Customize This Plan
                  </Button>
                </div>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-48 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                  <img
                    src="https://images.unsplash.com/photo-1599661046289-e3ffe6b5b5bf?q=80&w=2070&auto=format&fit=crop"
                    alt="Rajasthan Heritage"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Rajasthan Heritage Tour</h3>
                    <p className="text-sm">7 Days • Cultural Experience</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-3">
                    Explore the rich cultural heritage of Rajasthan with visits to historical forts, palaces, and traditional villages. Includes accommodation and transportation options.
                  </div>
                  <Button
                    onClick={() => setShowAIPlanner(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Customize This Plan
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Customer Testimonials */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">What Travelers Say About Our AI Planner</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 rounded-lg relative">
                <div className="absolute -top-4 -left-4 text-emerald-200 text-6xl">"</div>
                <p className="text-gray-600 mb-4 relative z-10">The AI Travel Planner saved me hours of research. It suggested attractions I would never have found on my own and created a perfect itinerary that matched my interests perfectly.</p>
                <div className="font-semibold">- Ananya, Mumbai</div>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg relative">
                <div className="absolute -top-4 -left-4 text-emerald-200 text-6xl">"</div>
                <p className="text-gray-600 mb-4 relative z-10">As a solo traveler with a tight budget, I was amazed at how well the AI understood my constraints. It designed a trip that was affordable yet didn't compromise on experiences.</p>
                <div className="font-semibold">- Vikram, Bangalore</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Travel Planner Modal */}
      {showAIPlanner && <AITravelPlanner onClose={() => setShowAIPlanner(false)} />}
    </div>
  );
};

export default AITravelPlannerPage;
