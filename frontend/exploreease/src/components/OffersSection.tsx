'use client';

import React from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const OffersSection = () => {
  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-500 mb-6">Special Offers & Deals</h2>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 bg-transparent p-0 border-b border-gray-700">
              <TabsTrigger
                value="all"
                className="data-[state=active]:border-amber-500 data-[state=active]:border-b-2 data-[state=active]:text-amber-500 rounded-none px-4 py-2 font-medium text-gray-300"
              >
                All Offers
              </TabsTrigger>
              <TabsTrigger
                value="trains"
                className="data-[state=active]:border-amber-500 data-[state=active]:border-b-2 data-[state=active]:text-amber-500 rounded-none px-4 py-2 font-medium text-gray-300"
              >
                Trains
              </TabsTrigger>
              <TabsTrigger
                value="flights"
                className="data-[state=active]:border-amber-500 data-[state=active]:border-b-2 data-[state=active]:text-amber-500 rounded-none px-4 py-2 font-medium text-gray-300"
              >
                Flights
              </TabsTrigger>
              <TabsTrigger
                value="hotels"
                className="data-[state=active]:border-amber-500 data-[state=active]:border-b-2 data-[state=active]:text-amber-500 rounded-none px-4 py-2 font-medium text-gray-300"
              >
                Hotels
              </TabsTrigger>
            </TabsList>

            {/* All Offers */}
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Train Offer */}
                <Card className="overflow-hidden bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <div className="flex flex-col">
                      <div className="relative h-48">
                        <Image
                          src="https://images.unsplash.com/photo-1554487448-e577aaf5ada5?q=80&w=1770&auto=format&fit=crop"
                          alt="Train Offer"
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-xs text-gray-400 mb-1">TRAINS</div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">CONFIRMED SEATS GUARANTEE</h3>
                        <p className="text-sm text-gray-400 mb-4">Get up to 20% cashback on IRCTC train bookings!</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-300">Code: <span className="font-semibold text-amber-500">TRAINEASE</span></div>
                          <Button className="bg-amber-500 hover:bg-amber-600 text-white text-sm">
                            BOOK NOW
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hotel Offer */}
                <Card className="overflow-hidden bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <div className="flex flex-col">
                      <div className="relative h-48">
                        <Image
                          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1770&auto=format&fit=crop"
                          alt="Hotel Offer"
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-xs text-gray-400 mb-1">HOTELS</div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">LUXURY STAY SPECIAL</h3>
                        <p className="text-sm text-gray-400 mb-4">Up to 25% OFF on premium hotel bookings!</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-300">Code: <span className="font-semibold text-amber-500">STAYEASE</span></div>
                          <Button className="bg-amber-500 hover:bg-amber-600 text-white text-sm">
                            BOOK NOW
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Flight Offer */}
                <Card className="overflow-hidden bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <div className="flex flex-col">
                      <div className="relative h-48">
                        <Image
                          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1774&auto=format&fit=crop"
                          alt="Flight Offer"
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-xs text-gray-400 mb-1">FLIGHTS</div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">FLY FOR LESS</h3>
                        <p className="text-sm text-gray-400 mb-4">Get up to 15% OFF on domestic flights!</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-300">Code: <span className="font-semibold text-amber-500">FLYEASE</span></div>
                          <Button className="bg-amber-500 hover:bg-amber-600 text-white text-sm">
                            BOOK NOW
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Train Offers Tab */}
            <TabsContent value="trains" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/5 relative h-48 md:h-auto">
                        <Image
                          src="https://images.unsplash.com/photo-1554487448-e577aaf5ada5?q=80&w=1770&auto=format&fit=crop"
                          alt="Train Offer"
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="md:w-3/5 p-6">
                        <div className="text-xs text-gray-400 mb-1">TRAINS</div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">CONFIRMED SEATS GUARANTEE</h3>
                        <p className="text-sm text-gray-400 mb-4">Get up to 20% cashback on IRCTC train bookings with our special prediction algorithm that increases your chance of confirmed tickets!</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-300">Code: <span className="font-semibold text-amber-500">TRAINEASE</span></div>
                          <Button className="bg-amber-500 hover:bg-amber-600 text-white text-sm">
                            BOOK NOW
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/5 relative h-48 md:h-auto">
                        <Image
                          src="https://images.unsplash.com/photo-1517167685284-96a27fd715a2?q=80&w=1874&auto=format&fit=crop"
                          alt="Train Offer"
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="md:w-3/5 p-6">
                        <div className="text-xs text-gray-400 mb-1">TRAINS</div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">TATKAL BOOKING SPECIAL</h3>
                        <p className="text-sm text-gray-400 mb-4">Zero convenience fee on Tatkal bookings. Quick and easy booking process to secure your last-minute travel plans!</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-300">Code: <span className="font-semibold text-amber-500">TATKALEASE</span></div>
                          <Button className="bg-amber-500 hover:bg-amber-600 text-white text-sm">
                            BOOK NOW
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Flight Offers Tab */}
            <TabsContent value="flights" className="mt-0">
              <Card className="overflow-hidden bg-gray-800 border-gray-700">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative h-48 md:h-auto">
                      <Image
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1774&auto=format&fit=crop"
                        alt="Flight Offer"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="md:w-3/5 p-6">
                      <div className="text-xs text-gray-400 mb-1">FLIGHTS</div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">FLY FOR LESS</h3>
                      <p className="text-sm text-gray-400 mb-4">Get up to 15% OFF on domestic flights! Book now and save on your next journey.</p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-300">Code: <span className="font-semibold text-amber-500">FLYEASE</span></div>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white text-sm">
                          BOOK NOW
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hotel Offers Tab */}
            <TabsContent value="hotels" className="mt-0">
              <Card className="overflow-hidden bg-gray-800 border-gray-700">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative h-48 md:h-auto">
                      <Image
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1770&auto=format&fit=crop"
                        alt="Hotel Offer"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="md:w-3/5 p-6">
                      <div className="text-xs text-gray-400 mb-1">HOTELS</div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">LUXURY STAY SPECIAL</h3>
                      <p className="text-sm text-gray-400 mb-4">Up to 25% OFF on premium hotel bookings! Enjoy luxury accommodations at discounted rates.</p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-300">Code: <span className="font-semibold text-amber-500">STAYEASE</span></div>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white text-sm">
                          BOOK NOW
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
