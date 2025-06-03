// src/components/BookingReceipt.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface BookingReceiptProps {
  bookingId: string;
  paymentId: string;
  service: string;
  amount: number;
  details: any;
}

const BookingReceipt: React.FC<BookingReceiptProps> = ({ 
  bookingId, paymentId, service, amount, details 
}) => {
  const router = useRouter();
  
  return (
    <div className="bg-[#fff3da] border border-[#ffcc80] rounded-lg p-6 max-w-lg mx-auto">
      <div className="w-16 h-16 bg-[#ffe0b2] rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#fb8c00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-[#e65100] mb-2 text-center">Booking Confirmed!</h3>
      
      <div className="mt-6 border-t border-b border-[#ffcc80] py-4">
        <div className="flex justify-between py-1">
          <span className="text-[#232e3d] font-medium">Booking ID:</span>
          <span className="font-semibold">{bookingId}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[#232e3d] font-medium">Payment ID:</span>
          <span className="font-semibold">{paymentId}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[#232e3d] font-medium">Service:</span>
          <span className="font-semibold capitalize">{service}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[#232e3d] font-medium">Amount:</span>
          <span className="font-semibold">₹{amount.toLocaleString()}</span>
        </div>
        
        {/* Service-specific details */}
        {service === 'train' && (
          <>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">Train:</span>
              <span className="font-semibold">{details.trainNumber}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">From - To:</span>
              <span className="font-semibold">{details.from} - {details.to}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">Date:</span>
              <span className="font-semibold">{details.departureDate}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">Class:</span>
              <span className="font-semibold">{details.class}</span>
            </div>
          </>
        )}
        
        {service === 'flight' && (
          <>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">Flight:</span>
              <span className="font-semibold">{details.flightNumber}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">From - To:</span>
              <span className="font-semibold">{details.from} - {details.to}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">Date:</span>
              <span className="font-semibold">{details.departureDate}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">Class:</span>
              <span className="font-semibold">{details.class}</span>
            </div>
          </>
        )}
        
        {service === 'hotel' && (
          <>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">Hotel:</span>
              <span className="font-semibold">{details.hotelId}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">Check-in:</span>
              <span className="font-semibold">{details.checkIn}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">Check-out:</span>
              <span className="font-semibold">{details.checkOut}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#232e3d] font-medium">Guests:</span>
              <span className="font-semibold">{details.guests}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-6 space-y-3">
        <Button 
          onClick={() => router.push('/my-trips')}
          className="w-full bg-[#ffa726] hover:bg-[#ff9800] text-white"
        >
          View All My Trips
        </Button>
        <Button 
          onClick={() => router.push('/')}
          variant="outline"
          className="w-full border-[#ffa726] text-[#232e3d]"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default BookingReceipt;
