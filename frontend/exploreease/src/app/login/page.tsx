'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/auth';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [contactAgreed, setContactAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const handleContinue = () => {
    if (!email) {
      setError('Please enter your email or mobile number');
      return;
    }
    const isEmail = email.includes('@');
    if (isEmail) {
      setShowPasswordPrompt(true);
      setError(null);
    } else {
      setError('Please enter a valid email address');
    }
  };

  // FIXED: Pass email and password as two arguments,
  // and check for truthy user instead of response.success/response.message
  const handleLogin = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password); // <-- FIXED LINE
      if (user) {
        router.push('/');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Login failed. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg bg-gray-800 border-gray-700 text-gray-100">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-amber-500">Login to ExploreEase</CardTitle>
          <CardDescription className="text-gray-300">
            Get flat 12% OFF* on your first booking
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Google Login Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              className="w-full py-6 flex items-center justify-center border-gray-600 hover:bg-gray-700 text-gray-200"
              type="button"
            >
              <Image
                src="https://accounts.google.com/favicon.ico"
                alt="Google Icon"
                width={20}
                height={20}
                className="mr-2"
              />
              <span>Continue with Google</span>
            </Button>
          </div>

          <div className="relative flex items-center mb-6">
            <hr className="flex-grow border-t border-gray-700" />
            <span className="flex-shrink mx-4 text-gray-400 text-sm">Or Login/Signup With</span>
            <hr className="flex-grow border-t border-gray-700" />
          </div>

          {error && (
            <div className="bg-red-900 text-red-200 p-3 rounded-md mb-4 text-sm border border-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email-or-mobile" className="block text-sm font-medium text-gray-300 mb-1">
                Email or Mobile Number
              </Label>
              <Input
                id="email-or-mobile"
                placeholder="Enter email or mobile number"
                className="h-12 px-4 border-gray-600 focus:border-amber-500 bg-gray-700 text-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center mt-4">
              <Checkbox
                id="terms-agreement"
                className="mr-2 text-amber-500 border-gray-600"
                checked={termsAgreed}
                onCheckedChange={(checked) => setTermsAgreed(!!checked)}
              />
              <Label htmlFor="terms-agreement" className="text-xs text-gray-300">
                By signing in or creating an account, you agree to ExploreEase's{' '}
                <Link href="/privacy-policy" className="text-amber-500 hover:underline">Privacy Policy</Link>,{' '}
                <Link href="/user-agreement" className="text-amber-500 hover:underline">User Agreement</Link> and{' '}
                <Link href="/terms" className="text-amber-500 hover:underline">T&Cs</Link>
              </Label>
            </div>

            <div className="flex items-center mt-2">
              <Checkbox
                id="contact-agreement"
                className="mr-2 text-amber-500 border-gray-600"
                checked={contactAgreed}
                onCheckedChange={(checked) => setContactAgreed(!!checked)}
              />
              <Label htmlFor="contact-agreement" className="text-xs text-gray-300">
                I hereby allow ExploreEase to contact me regarding travel services, that may be of interest to me
              </Label>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 py-6 text-base"
            onClick={handleContinue}
            disabled={!termsAgreed || loading}
          >
            {loading ? 'PLEASE WAIT...' : 'CONTINUE'}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showPasswordPrompt} onOpenChange={setShowPasswordPrompt}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-amber-500">Enter Your Password</DialogTitle>
            <DialogDescription className="text-gray-300">
              Please enter the password for {email}
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-12 px-4 border-gray-600 focus:border-amber-500 bg-gray-700 text-gray-100 pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-icons">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <div className="text-right mt-1">
              <Link href="/forgot-password" className="text-amber-500 hover:underline text-sm">
                Forgot Password?
              </Link>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 py-6 text-base"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
