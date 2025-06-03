'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';

// === FIX: Add the phone property here! ===
interface User {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  // add other properties as needed
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  dob?: string;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    seatingPreference?: string;
    mealPreference?: string;
    specialAssistance?: boolean;
    currency?: string;
    language?: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Get user profile
    const user = getCurrentUser() as User; // We can now safely cast as User with phone
    if (user) {
      setProfile({
        id: Number(user.id),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        profilePic: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop',
        dob: '1990-01-01',
        gender: 'male',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        preferences: {
          seatingPreference: 'window',
          mealPreference: 'vegetarian',
          specialAssistance: false,
          currency: 'USD',
          language: 'English',
        }
      });

      setLoading(false);
    }
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      // Simulate API update
      setTimeout(() => {
        setUpdating(false);
        alert('Profile updated successfully!');
      }, 1000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setPasswordError(null);

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      setUpdating(false);
      return;
    }

    try {
      // Simulate API update
      setTimeout(() => {
        setUpdating(false);
        setShowPasswordDialog(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        alert('Password updated successfully!');
      }, 1000);
    } catch (err) {
      setPasswordError('Failed to update password. Please try again.');
      setUpdating(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [parentKey]: {
            ...prev[parentKey as keyof UserProfile] as Record<string, unknown>,
            [childKey]: value,
          }
        };
      });
    } else {
      setProfile(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean, name: string) => {
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [parentKey]: {
            ...prev[parentKey as keyof UserProfile] as Record<string, unknown>,
            [childKey]: checked,
          }
        };
      });
    } else {
      setProfile(prev => prev ? { ...prev, [name]: checked } : null);
    }
  };

  // Handle password form input changes
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Profile</h2>
          <p className="text-gray-300 mb-4">We couldn't load your profile information. Please try again later.</p>
          <Button onClick={() => router.push('/')} className="bg-amber-500 hover:bg-amber-600 text-gray-900">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-8 text-gray-200">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-amber-500 mb-6">My Profile</h1>

        <Tabs defaultValue="personal">
          <TabsList className="mb-8 bg-gray-800 p-1 rounded-md border border-gray-700">
            <TabsTrigger value="personal" className="text-base py-2 px-4 data-[state=active]:bg-gray-700 data-[state=active]:text-amber-500">Personal Information</TabsTrigger>
            <TabsTrigger value="preferences" className="text-base py-2 px-4 data-[state=active]:bg-gray-700 data-[state=active]:text-amber-500">Travel Preferences</TabsTrigger>
            <TabsTrigger value="security" className="text-base py-2 px-4 data-[state=active]:bg-gray-700 data-[state=active]:text-amber-500">Account & Security</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-amber-500">Personal Information</CardTitle>
                <CardDescription className="text-gray-300">Update your personal details</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center mb-6">
                    <div className="relative w-32 h-32 mr-6">
                      <Image
                        src={profile.profilePic || 'https://via.placeholder.com/128'}
                        alt="Profile"
                        className="rounded-full border-4 border-white shadow-md"
                        width={128}
                        height={128}
                      />
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow"
                      >
                        <span className="material-icons text-amber-500">edit</span>
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{profile.name}</h3>
                      <p className="text-gray-300">{profile.email}</p>
                      <p className="text-sm text-amber-500 mt-2">Upload a new photo</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div>
                      <Label htmlFor="name" className="mb-1">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="mb-4"
                      />

                      <Label htmlFor="email" className="mb-1">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="mb-4"
                        readOnly
                      />

                      <Label htmlFor="phone" className="mb-1">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone || ''}
                        onChange={handleInputChange}
                        className="mb-4"
                      />
                    </div>

                    {/* Additional Info */}
                    <div>
                      <Label htmlFor="dob" className="mb-1">Date of Birth</Label>
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={profile.dob || ''}
                        onChange={handleInputChange}
                        className="mb-4"
                      />

                      <Label className="mb-1">Gender</Label>
                      <RadioGroup
                        name="gender"
                        value={profile.gender || 'prefer-not-to-say'}
                        onValueChange={(value) => setProfile(prev => prev ? { ...prev, gender: value } : null)}
                        className="mb-4 flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="gender-male" />
                          <Label htmlFor="gender-male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="gender-female" />
                          <Label htmlFor="gender-female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="prefer-not-to-say" id="gender-not-say" />
                          <Label htmlFor="gender-not-say">Prefer not to say</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Address Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="address.street" className="mb-1">Street Address</Label>
                        <Input
                          id="address.street"
                          name="address.street"
                          value={profile.address?.street || ''}
                          onChange={handleInputChange}
                          className="mb-4"
                        />

                        <Label htmlFor="address.city" className="mb-1">City</Label>
                        <Input
                          id="address.city"
                          name="address.city"
                          value={profile.address?.city || ''}
                          onChange={handleInputChange}
                          className="mb-4"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address.state" className="mb-1">State</Label>
                        <Input
                          id="address.state"
                          name="address.state"
                          value={profile.address?.state || ''}
                          onChange={handleInputChange}
                          className="mb-4"
                        />

                        <Label htmlFor="address.zipCode" className="mb-1">Zip Code</Label>
                        <Input
                          id="address.zipCode"
                          name="address.zipCode"
                          value={profile.address?.zipCode || ''}
                          onChange={handleInputChange}
                          className="mb-4"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address.country" className="mb-1">Country</Label>
                      <Input
                        id="address.country"
                        name="address.country"
                        value={profile.address?.country || ''}
                        onChange={handleInputChange}
                        className="mb-4"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-900 text-red-200 p-3 rounded-md border border-red-800">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-gray-900" disabled={updating}>
                      {updating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Travel Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-amber-500">Travel Preferences</CardTitle>
                <CardDescription className="text-gray-300">Customize your travel experience</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Seating & Meal Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="mb-2 block">Seat Preference</Label>
                      <RadioGroup
                        name="preferences.seatingPreference"
                        value={profile.preferences?.seatingPreference || 'no-preference'}
                        onValueChange={(value) => setProfile(prev => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            preferences: {
                              ...(prev.preferences || {}),
                              seatingPreference: value
                            }
                          };
                        })}
                        className="mb-4 space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="window" id="seat-window" />
                          <Label htmlFor="seat-window">Window</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="aisle" id="seat-aisle" />
                          <Label htmlFor="seat-aisle">Aisle</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="middle" id="seat-middle" />
                          <Label htmlFor="seat-middle">Middle</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no-preference" id="seat-no-preference" />
                          <Label htmlFor="seat-no-preference">No Preference</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="mb-2 block">Meal Preference</Label>
                      <RadioGroup
                        name="preferences.mealPreference"
                        value={profile.preferences?.mealPreference || 'no-preference'}
                        onValueChange={(value) => setProfile(prev => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            preferences: {
                              ...(prev.preferences || {}),
                              mealPreference: value
                            }
                          };
                        })}
                        className="mb-4 space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vegetarian" id="meal-veg" />
                          <Label htmlFor="meal-veg">Vegetarian</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non-vegetarian" id="meal-non-veg" />
                          <Label htmlFor="meal-non-veg">Non-Vegetarian</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vegan" id="meal-vegan" />
                          <Label htmlFor="meal-vegan">Vegan</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no-preference" id="meal-no-preference" />
                          <Label htmlFor="meal-no-preference">No Preference</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Special Assistance */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Special Assistance</h3>

                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id="special-assistance"
                        checked={profile.preferences?.specialAssistance || false}
                        onCheckedChange={(checked) => handleCheckboxChange(!!checked, 'preferences.specialAssistance')}
                      />
                      <Label htmlFor="special-assistance">I require special assistance during travel</Label>
                    </div>

                    {profile.preferences?.specialAssistance && (
                      <div className="ml-7 mb-6">
                        <Label htmlFor="assistance-details" className="mb-1">Please specify your requirements</Label>
                        <textarea
                          id="assistance-details"
                          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          rows={3}
                          placeholder="Describe any special assistance you require..."
                        ></textarea>
                      </div>
                    )}
                  </div>

                  {/* App Preferences */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">App Preferences</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="preferences.currency" className="mb-1">Currency</Label>
                        <select
                          id="preferences.currency"
                          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          value={profile.preferences?.currency || 'USD'}
                          onChange={(e) => setProfile(prev => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              preferences: {
                                ...(prev.preferences || {}),
                                currency: e.target.value
                              }
                            };
                          })}
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="INR">INR - Indian Rupee</option>
                          <option value="JPY">JPY - Japanese Yen</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="preferences.language" className="mb-1">Language</Label>
                        <select
                          id="preferences.language"
                          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          value={profile.preferences?.language || 'English'}
                          onChange={(e) => setProfile(prev => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              preferences: {
                                ...(prev.preferences || {}),
                                language: e.target.value
                              }
                            };
                          })}
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Japanese">Japanese</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-900 text-red-200 p-3 rounded-md border border-red-800">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-gray-900" disabled={updating}>
                      {updating ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account & Security Tab */}
          <TabsContent value="security">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-amber-500">Account & Security</CardTitle>
                <CardDescription className="text-gray-300">Manage your account security settings</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Email Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Email Address</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border">
                    <div>
                      <p className="font-medium">{profile.email}</p>
                      <p className="text-sm text-green-600">Verified</p>
                    </div>
                    <Button variant="outline">Change Email</Button>
                  </div>
                </div>

                {/* Password Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Password</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-gray-500">Last changed 2 months ago</p>
                    </div>
                    <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Change Password</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Your Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and a new password below.
                          </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handlePasswordUpdate} className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="currentPassword" className="mb-1">Current Password</Label>
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordInputChange}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="newPassword" className="mb-1">New Password</Label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordInputChange}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="confirmPassword" className="mb-1">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordInputChange}
                              required
                            />
                          </div>

                          {passwordError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                              {passwordError}
                            </div>
                          )}

                          <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-gray-900" disabled={updating}>
                              {updating ? 'Updating...' : 'Update Password'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border">
                    <div>
                      <p className="font-medium">Add an extra layer of security</p>
                      <p className="text-sm text-gray-500">Protect your account with 2FA</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                {/* Account Deletion */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-md border border-red-200">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
