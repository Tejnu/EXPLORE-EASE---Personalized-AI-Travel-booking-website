'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import RazorpayPayment from './RazorpayPayment';

interface BookingFormProps {
  type: 'flight' | 'train' | 'hotel' | 'bus';
  item: any; // The flight, train, hotel, or bus details
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

interface FormData {
  contactEmail: string;
  contactPhone: string;
  passengers: {
    name: string;
    age?: number;
    gender: 'male' | 'female' | 'other';
  }[];
  class?: string;
  fareType?: string;
  termsAccepted: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ type, item, onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      passengers: [{ name: '', age: undefined, gender: 'male' }],
      termsAccepted: false
    }
  });

  const termsAccepted = watch('termsAccepted');

  const getTotalAmount = () => {
    // This would be calculated based on the item type and selected options
    if (type === 'flight') {
      return item.price || 2500;
    } else if (type === 'train') {
      const selectedClass = watch('class') || 'ac3Tier';
      return item.classes?.[selectedClass]?.fare || 1500;
    } else if (type === 'hotel') {
      return item.price || 3500;
    } else {
      return item.price || 1000;
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      // Prepare the request body based on the type
      let requestBody: any;
      let endpoint: string;

      switch (type) {
        case 'flight':
          endpoint = '/api/booking/flight';
          requestBody = {
            flightId: item.id,
            airline: item.airline,
            flightNumber: item.flightNumber,
            from: item.from,
            to: item.to,
            date: item.date,
            departureTime: item.departureTime,
            arrivalTime: item.arrivalTime,
            class: data.class || 'Economy',
            fareType: data.fareType || 'Regular',
            passengers: data.passengers,
            contactInfo: {
              email: data.contactEmail,
              phone: data.contactPhone
            },
            amount: getTotalAmount() * data.passengers.length
          };
          break;

        case 'train':
          endpoint = '/api/booking/train';
          requestBody = {
            trainNumber: item.trainNumber,
            trainName: item.trainName,
            from: item.source,
            to: item.destination,
            date: item.date,
            departureTime: item.departureTime,
            arrivalTime: item.arrivalTime,
            class: data.class || 'sleeper',
            passengers: data.passengers,
            contactInfo: {
              email: data.contactEmail,
              phone: data.contactPhone
            },
            amount: getTotalAmount() * data.passengers.length
          };
          break;

        default:
          throw new Error(`Booking for ${type} not implemented yet`);
      }

      // Make the API request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Failed to book ${type}`);
      }

      // Store the booking data
      setBookingData({
        ...result,
        amount: getTotalAmount() * data.passengers.length,
        service: type,
        passengers: data.passengers,
        contactInfo: {
          email: data.contactEmail,
          phone: data.contactPhone
        }
      });

      // Show payment dialog
      setShowPayment(true);
    } catch (err: any) {
      console.error(`Error booking ${type}:`, err);
      setError(err.message || `Failed to process ${type} booking`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    // Combine booking and payment data for the success callback
    if (onSuccess) {
      onSuccess({
        booking: bookingData,
        payment: paymentData
      });
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'flight': return `Book Flight: ${item.airline} ${item.flightNumber}`;
      case 'train': return `Book Train: ${item.trainName} (${item.trainNumber})`;
      case 'hotel': return `Book Hotel: ${item.name}`;
      case 'bus': return `Book Bus: ${item.provider} ${item.busNumber}`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{getTitle()}</h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Passenger Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Passenger Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <Label htmlFor="passenger-name">Full Name</Label>
                  <Input
                    id="passenger-name"
                    {...register('passengers.0.name', { required: "Passenger name is required" })}
                  />
                  {errors.passengers?.[0]?.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.passengers[0].name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="passenger-age">Age</Label>
                  <Input
                    id="passenger-age"
                    type="number"
                    {...register('passengers.0.age', {
                      required: "Age is required",
                      min: { value: 1, message: "Age must be at least 1" },
                      max: { value: 120, message: "Age must be less than 120" }
                    })}
                  />
                  {errors.passengers?.[0]?.age && (
                    <p className="text-red-500 text-xs mt-1">{errors.passengers[0].age.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label>Gender</Label>
                  <RadioGroup defaultValue="male" className="flex space-x-4 mt-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="male"
                        id="gender-male"
                        {...register('passengers.0.gender')}
                      />
                      <Label htmlFor="gender-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="female"
                        id="gender-female"
                        {...register('passengers.0.gender')}
                      />
                      <Label htmlFor="gender-female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="other"
                        id="gender-other"
                        {...register('passengers.0.gender')}
                      />
                      <Label htmlFor="gender-other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    {...register('contactEmail', {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email format"
                      }
                    })}
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    {...register('contactPhone', {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be 10 digits"
                      }
                    })}
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={() => setStep(2)} className="w-full">
                Next: Travel Options
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Travel Options */}
        {step === 2 && (
          <div className="space-y-4">
            {type === 'flight' && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Select Class</h3>
                <RadioGroup defaultValue="Economy" className="space-y-2">
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem
                      value="Economy"
                      id="class-economy"
                      {...register('class')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="class-economy" className="font-medium">Economy</Label>
                      <p className="text-sm text-gray-500">Standard seating with basic amenities</p>
                    </div>
                    <span className="font-semibold">₹{item.price?.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem
                      value="Premium Economy"
                      id="class-premium"
                      {...register('class')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="class-premium" className="font-medium">Premium Economy</Label>
                      <p className="text-sm text-gray-500">More legroom and enhanced service</p>
                    </div>
                    <span className="font-semibold">₹{Math.round(item.price * 1.3)?.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem
                      value="Business"
                      id="class-business"
                      {...register('class')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="class-business" className="font-medium">Business</Label>
                      <p className="text-sm text-gray-500">Luxury experience with priority services</p>
                    </div>
                    <span className="font-semibold">₹{Math.round(item.price * 2.5)?.toLocaleString()}</span>
                  </div>
                </RadioGroup>
              </div>
            )}

            {type === 'train' && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Select Class</h3>
                <RadioGroup defaultValue="ac3Tier" className="space-y-2">
                  {item.classes?.firstClass?.available && (
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem
                        value="firstClass"
                        id="class-first"
                        {...register('class')}
                      />
                      <div className="flex-1">
                        <Label htmlFor="class-first" className="font-medium">First Class AC</Label>
                        <p className="text-sm text-gray-500">Premium compartments with all amenities</p>
                      </div>
                      <span className="font-semibold">₹{item.classes.firstClass.fare.toLocaleString()}</span>
                    </div>
                  )}

                  {item.classes?.ac3Tier?.available && (
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem
                        value="ac3Tier"
                        id="class-ac3"
                        {...register('class')}
                      />
                      <div className="flex-1">
                        <Label htmlFor="class-ac3" className="font-medium">AC 3-Tier</Label>
                        <p className="text-sm text-gray-500">Air-conditioned sleeper coach</p>
                      </div>
                      <span className="font-semibold">₹{item.classes.ac3Tier.fare.toLocaleString()}</span>
                    </div>
                  )}

                  {item.classes?.sleeper?.available && (
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem
                        value="sleeper"
                        id="class-sleeper"
                        {...register('class')}
                      />
                      <div className="flex-1">
                        <Label htmlFor="class-sleeper" className="font-medium">Sleeper Class</Label>
                        <p className="text-sm text-gray-500">Non-AC sleeper coach</p>
                      </div>
                      <span className="font-semibold">₹{item.classes.sleeper.fare.toLocaleString()}</span>
                    </div>
                  )}

                  {item.classes?.general?.available && (
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem
                        value="general"
                        id="class-general"
                        {...register('class')}
                      />
                      <div className="flex-1">
                        <Label htmlFor="class-general" className="font-medium">General</Label>
                        <p className="text-sm text-gray-500">Standard seating coach</p>
                      </div>
                      <span className="font-semibold">₹{item.classes.general.fare.toLocaleString()}</span>
                    </div>
                  )}
                </RadioGroup>
              </div>
            )}

            <div className="space-y-2 border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold">Fare Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>₹{getTotalAmount().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span>₹{Math.round(getTotalAmount() * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total Amount</span>
                  <span>₹{Math.round(getTotalAmount() * 1.05).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  {...register('termsAccepted', { required: true })}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions, cancellation policy, and privacy policy of ExploreEase.
                </Label>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!termsAccepted || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : `Proceed to Payment`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Payment Dialog */}
      {showPayment && bookingData && (
        <RazorpayPayment
          open={showPayment}
          onClose={() => setShowPayment(false)}
          bookingId={bookingData.bookingId}
          amount={bookingData.amount}
          service={bookingData.service}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={() => setError("Payment failed. Please try again.")}
          customerInfo={{
            name: bookingData.passengers[0].name,
            email: bookingData.contactInfo.email,
            phone: bookingData.contactInfo.phone
          }}
        />
      )}
    </div>
  );
};

export default BookingForm;
