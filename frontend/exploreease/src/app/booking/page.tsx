'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Extract booking parameters safely
  const service = searchParams.get('service'); // 'train', 'flight', or 'hotel'
  const id = searchParams.get('id'); // trainId, flightId, or hotelId
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const className = searchParams.get('class');
  const amount = Number(searchParams.get('amount') || '0');
  
  // For hotels
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Generate a booking ID when component loads
    if (!bookingId) {
      setBookingId(`${service?.toUpperCase() || 'BOOK'}-${Date.now()}`);
    }
  }, [service, bookingId]);

  const handleInitiatePayment = () => {
    setShowPayment(true);
  };
  
  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  // Mock payment success for testing (remove in production)
  const simulatePaymentSuccess = () => {
    setPaymentSuccess(true);
    setPaymentData({
      paymentId: `PAY-${Date.now()}`,
      status: 'success'
    });
    
    // Save booking to user's trips in localStorage
    try {
      const tripDetails = {
        bookingId,
        paymentId: `PAY-${Date.now()}`,
        service: service || 'booking',
        date: new Date().toISOString(),
        status: 'Confirmed',
        amount,
        details: {
          // For train
          ...(service === 'train' && {
            trainNumber: id,
            from,
            to,
            departureDate: date,
            class: className,
          }),
          // For flight
          ...(service === 'flight' && {
            flightNumber: id,
            from,
            to,
            departureDate: date,
            class: className,
          }),
          // For hotel
          ...(service === 'hotel' && {
            hotelId: id,
            checkIn,
            checkOut,
            guests,
          }),
        }
      };
      
      // Save trip to local storage
      const existingTrips = JSON.parse(localStorage.getItem('userTrips') || '[]');
      const updatedTrips = [tripDetails, ...existingTrips];
      localStorage.setItem('userTrips', JSON.stringify(updatedTrips));
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  if (!service || !id || !amount) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f5f6fa]">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Booking Request</h1>
          <p className="mb-4">Missing required booking parameters.</p>
          <button 
            onClick={() => router.back()}
            className="w-full bg-[#ffa726] text-white py-2 rounded-lg hover:bg-[#ff9800]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#232e3d] p-6">
            <h1 className="text-2xl font-bold text-white">Complete Your Booking</h1>
          </div>

          {/* Booking Details */}
          <div className="p-6">
            {!paymentSuccess ? (
              <>
                <h2 className="text-xl font-semibold mb-4 text-[#232e3d]">Booking Summary</h2>
                
                <div className="border-t border-b py-4 space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium capitalize">{service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{bookingId}</span>
                  </div>
                  {service === 'train' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Train:</span>
                        <span className="font-medium">{id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">From-To:</span>
                        <span className="font-medium">{from} - {to}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Class:</span>
                        <span className="font-medium">{className}</span>
                      </div>
                    </>
                  )}
                  {service === 'flight' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Flight:</span>
                        <span className="font-medium">{id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">From-To:</span>
                        <span className="font-medium">{from} - {to}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Class:</span>
                        <span className="font-medium">{className}</span>
                      </div>
                    </>
                  )}
                  {service === 'hotel' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hotel:</span>
                        <span className="font-medium">{id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{checkIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">{checkOut}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{guests}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-800 font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-[#ffa726]">₹{amount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment section */}
                <div className="text-center">
                  <button
                    onClick={handleInitiatePayment}
                    className="w-full md:w-auto px-8 py-3 bg-[#ffa726] text-white font-semibold rounded-lg hover:bg-[#ff9800] transition"
                  >
                    Proceed to Payment
                  </button>
                  <p className="mt-2 text-sm text-gray-500">Click above to pay securely</p>
                  
                  {/* For development only - remove in production */}
                  <button
                    onClick={simulatePaymentSuccess}
                    className="mt-4 text-sm text-blue-500 underline"
                  >
                    Simulate Payment Success (Dev Only)
                  </button>
                </div>
                
                {/* Payment Modal - For now, we'll show a simplified version */}
                {showPayment && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Payment</h2>
                        <button onClick={handlePaymentClose} className="text-gray-500">
                          <span className="material-icons">close</span>
                        </button>
                      </div>
                      <p className="mb-4">Amount: ₹{amount.toLocaleString()}</p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-1">Card Number</label>
                          <input type="text" className="w-full border p-2 rounded" placeholder="4242 4242 4242 4242" />
                        </div>
                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm mb-1">Expiry</label>
                            <input type="text" className="w-full border p-2 rounded" placeholder="MM/YY" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm mb-1">CVV</label>
                            <input type="text" className="w-full border p-2 rounded" placeholder="123" />
                          </div>
                        </div>
                        <button
                          onClick={simulatePaymentSuccess}
                          className="w-full bg-[#ffa726] text-white py-2 rounded-lg hover:bg-[#ff9800]"
                        >
                          Pay ₹{amount.toLocaleString()}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-[#fff3da] border border-[#ffcc80] rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-[#ffe0b2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-[#fb8c00] text-2xl">check</span>
                </div>
                
                <h3 className="text-xl font-bold text-[#e65100] mb-2">Payment Successful!</h3>
                <p className="text-[#f57c00] mb-4">Your booking has been confirmed.</p>
                
                <div className="bg-white rounded-lg p-4 mb-6 text-left">
                  <div className="flex justify-between py-1">
                    <span className="text-[#232e3d] font-medium">Booking ID:</span>
                    <span className="font-semibold">{bookingId}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#232e3d] font-medium">Payment ID:</span>
                    <span className="font-semibold">{paymentData?.paymentId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b pb-2 mb-2">
                    <span className="text-[#232e3d] font-medium">Amount:</span>
                    <span className="font-semibold">₹{amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 text-center mt-2">
                    A confirmation has been sent to your email
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 justify-center">
                  <button
                    onClick={() => router.push('/my-trips')}
                    className="bg-[#ffa726] text-white px-6 py-2 rounded-lg hover:bg-[#ff9800] transition"
                  >
                    View My Trips
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="border border-[#ffa726] text-[#ffa726] px-6 py-2 rounded-lg hover:bg-[#fff8e1] transition"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
