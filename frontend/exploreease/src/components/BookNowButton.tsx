// src/components/BookNowButton.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface BookNowButtonProps {
  // Common props for all booking types
  service: 'train' | 'flight' | 'hotel';
  id: string | number;
  amount: number;
  
  // Service-specific props
  // For trains/flights
  from?: string;
  to?: string;
  date?: string;
  travelClass?: string; // Changed from className to travelClass
  
  // For hotels
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  
  // UI customization
  variant?: 'default' | 'outline' | 'secondary';
  fullWidth?: boolean;
  className?: string; // Button CSS class
}

export default function BookNowButton({
  service,
  id,
  amount,
  from,
  to,
  date,
  travelClass, // Changed from className to travelClass
  checkIn,
  checkOut,
  guests,
  variant = 'default',
  fullWidth = false,
  className = '',
}: BookNowButtonProps) {
  const router = useRouter();
  
  const handleBookNow = () => {
    // Build query params based on service type
    const params = new URLSearchParams();
    
    // Common params
    params.append('service', service);
    params.append('id', id.toString());
    params.append('amount', amount.toString());
    
    // Service-specific params
    if (service === 'train' || service === 'flight') {
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (date) params.append('date', date);
      if (travelClass) params.append('class', travelClass);
    } else if (service === 'hotel') {
      if (checkIn) params.append('checkIn', checkIn);
      if (checkOut) params.append('checkOut', checkOut);
      if (guests) params.append('guests', guests.toString());
    }
    
    // Navigate to booking page with all parameters
    router.push(`/booking?${params.toString()}`);
  };
  
  return (
    <Button
      variant={variant}
      onClick={handleBookNow}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      Book Now
    </Button>
  );
}
