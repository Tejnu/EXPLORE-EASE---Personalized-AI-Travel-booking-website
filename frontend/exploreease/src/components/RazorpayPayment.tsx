'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentSession {
  bookingId: string;
  amount: number;
  service: string;
  currency: string;
  timestamp: string;
  razorpayOptions: {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image: string;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    notes: {
      bookingId: string;
      service: string;
    };
    theme: {
      color: string;
    };
  };
}

interface RazorpayPaymentProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  service: string;
  onPaymentSuccess?: (response: any) => void;
  onPaymentFailure?: (error: any) => void;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  open,
  onClose,
  bookingId,
  amount,
  service,
  onPaymentSuccess,
  onPaymentFailure,
  customerInfo
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);

  // Load Razorpay script
  useEffect(() => {
    if (!open) return;

    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => fetchPaymentSession();
      script.onerror = () => {
        setError('Failed to load Razorpay. Please try again later.');
        setLoading(false);
      };
      document.body.appendChild(script);
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      fetchPaymentSession();
    }
  }, [open, bookingId, amount, service]);

  const fetchPaymentSession = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payment?bookingId=${bookingId}&amount=${amount}&service=${service}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      setPaymentSession(data.paymentSession);
      setLoading(false);
    } catch (err) {
      console.error('Payment session error:', err);
      setError('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (!paymentSession || !window.Razorpay) {
      setError('Payment system is not ready. Please try again.');
      return;
    }

    try {
      // Update prefill with customer info if provided
      if (customerInfo) {
        paymentSession.razorpayOptions.prefill = {
          name: customerInfo.name || '',
          email: customerInfo.email || '',
          contact: customerInfo.phone || ''
        };
      }

      const razorpayOptions = {
        ...paymentSession.razorpayOptions,
        handler: function (response: any) {
          // Payment successful
          const paymentData = {
            bookingId: paymentSession.bookingId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: paymentSession.amount
          };

          // Send confirmation to our API
          fetch('/api/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                if (onPaymentSuccess) onPaymentSuccess(data);
                onClose();
              } else {
                throw new Error(data.error || 'Payment verification failed');
              }
            })
            .catch(err => {
              console.error('Payment verification error:', err);
              if (onPaymentFailure) onPaymentFailure(err);
              setError('Payment was received but verification failed. Please contact support.');
            });
        },
        modal: {
          ondismiss: function() {
            onClose();
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      setError('Failed to open payment gateway. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            Secure payment for your {service} booking #{bookingId}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="ml-2">Initializing payment...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 p-3 rounded bg-red-50 text-center">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Booking ID:</span>
                <span>{bookingId}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Service:</span>
                <span className="capitalize">{service}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Amount:</span>
                <span className="text-lg font-bold">₹{amount.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Click the button below to proceed to our secure payment gateway powered by Razorpay.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={loading || !!error}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Pay Now ₹{amount.toLocaleString()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayPayment;
