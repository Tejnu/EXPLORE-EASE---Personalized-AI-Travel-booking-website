'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const FeaturesSection = () => {
  return (
    <section className="py-12 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-amber-500">Our Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* AI Travel Planner */}
          <Card className="bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-600">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-amber-500 text-3xl">smart_toy</span>
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">AI Travel Planner</h3>
              <p className="text-sm text-gray-300">Our AI assistant creates personalized travel itineraries tailored to your preferences and budget.</p>
            </CardContent>
          </Card>

          {/* IRCTC Train Booking */}
          <Card className="bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-600">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-amber-500 text-3xl">train</span>
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">IRCTC Train Booking</h3>
              <p className="text-sm text-gray-300">Book confirmed IRCTC train tickets with our prediction technology that increases your chance of getting seats.</p>
            </CardContent>
          </Card>

          {/* Flight Booking */}
          <Card className="bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-600">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-amber-500 text-3xl">flight</span>
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">Flight Booking</h3>
              <p className="text-sm text-gray-300">Find the best deals on domestic and international flights with our fare comparison engine.</p>
            </CardContent>
          </Card>

          {/* Hotel Booking */}
          <Card className="bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-600">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-amber-500 text-3xl">hotel</span>
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">Hotel Booking</h3>
              <p className="text-sm text-gray-300">Book from thousands of hotels worldwide with free cancellation options and best price guarantees.</p>
            </CardContent>
          </Card>
        </div>

        {/* Train Booking Features */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-10 text-amber-500">Why Book Train Tickets With Us?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center text-center border-gray-600">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-amber-500 text-3xl">confirmation_number</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-200">Confirmed Tickets Guarantee</h3>
              <p className="text-sm text-gray-300">Our prediction algorithm increases your chances of getting confirmed train tickets, even during peak seasons.</p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center text-center border-gray-600">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-amber-500 text-3xl">bolt</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-200">Tatkal Booking Made Easy</h3>
              <p className="text-sm text-gray-300">Quick and hassle-free Tatkal booking process with zero convenience fees. Perfect for last-minute travel plans.</p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center text-center border-gray-600">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-amber-500 text-3xl">autorenew</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-200">Instant Refunds</h3>
              <p className="text-sm text-gray-300">Get instant refunds on cancellations, making it easier to adjust your travel plans without hassle.</p>
            </div>
          </div>
        </div>

        {/* Customer Testimonial */}
        <div className="mt-16 bg-gray-700 p-8 rounded-lg shadow-md border-gray-600">
          <h2 className="text-2xl font-bold mb-6 text-amber-500 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-amber-500 flex">
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                </div>
                <span className="ml-2 text-gray-400">5.0</span>
              </div>
              <p className="text-gray-300 mb-4">"I was struggling to get confirmed train tickets for my family trip. EXPLOREEASE's prediction feature helped me secure seats when other platforms showed waitlist. Amazing service!"</p>
              <div className="font-semibold text-amber-400">- Rahul, Delhi</div>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-amber-500 flex">
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                  <span className="material-icons">star_half</span>
                </div>
                <span className="ml-2 text-gray-400">4.5</span>
              </div>
              <p className="text-gray-300 mb-4">"The AI Travel Planner saved me hours of research for my vacation. It suggested an itinerary that perfectly matched my interests and budget. Truly personalized service!"</p>
              <div className="font-semibold text-amber-400">- Priya, Mumbai</div>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-amber-500 flex">
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                  <span className="material-icons">star</span>
                </div>
                <span className="ml-2 text-gray-400">5.0</span>
              </div>
              <p className="text-gray-300 mb-4">"Booked my entire family vacation including trains, flights and hotels all in one place. The process was smooth and we even saved money with their exclusive deals!"</p>
              <div className="font-semibold text-amber-400">- Amit, Bangalore</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
