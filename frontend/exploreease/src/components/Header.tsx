'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AITravelPlanner from '@/components/AITravelPlanner'; // Import the AITravelPlanner component

// This is a temporary mockup - replace with your actual auth library
const mockAuth = {
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('isLoggedIn') === 'true';
  },
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
  }
};

// Define User interface locally
interface User {
  name: string;
  email: string;
}

const Header = () => {
  const router = useRouter();
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = mockAuth.isAuthenticated();
      setIsLoggedIn(authStatus);

      if (authStatus) {
        const userData = mockAuth.getCurrentUser();
        setUser(userData);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    mockAuth.logout();
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  return (
    <header className="w-full">
      {/* Top Navigation */}
      <div className="bg-[#232e3d] py-3 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            {/* Logo */}
            <Link href="/" className="mr-4">
              <div className="relative h-10 flex items-center">
                <span className="text-white font-bold text-2xl">
                  <span className="text-[#ffa726]">Explore</span>
                  <span className="text-white">Ease</span>
                </span>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden md:flex">
              <Link href="/trains" className="px-4 py-2 text-white hover:text-[#ffa726]">
                <span className="material-icons text-sm mr-1">train</span> Trains
              </Link>
              <Link href="/flights" className="px-4 py-2 text-white hover:text-[#ffa726]">
                <span className="material-icons text-sm mr-1">flight</span> Flights
              </Link>
              <Link href="/hotels" className="px-4 py-2 text-white hover:text-[#ffa726]">
                <span className="material-icons text-sm mr-1">hotel</span> Hotels
              </Link>
              <Link href="/holidays" className="px-4 py-2 text-white hover:text-[#ffa726]">
                <span className="material-icons text-sm mr-1">beach_access</span> Holidays
              </Link>
              <Link href="/bus" className="px-4 py-2 text-white hover:text-[#ffa726]">
                <span className="material-icons text-sm mr-1">directions_bus</span> Bus
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* AI Travel Planner Button - Changed to regular button */}
            <button
              onClick={() => setAiChatOpen(true)}
              className="bg-[#ffa726] hover:bg-[#ff9800] text-white flex items-center px-3 py-2 rounded-md"
            >
              <span className="material-icons text-sm mr-1">smart_toy</span>
              <span>AI Travel Planner</span>
            </button>

            {/* My Trips */}
            <Link href="/my-trips" className="flex items-center text-white text-sm">
              <span className="material-icons text-sm mr-1">schedule</span>
              <div className="flex flex-col">
                <span className="font-medium">My Trips</span>
                <span className="text-xs opacity-80">Manage your bookings</span>
              </div>
            </Link>

            {/* Login/Account */}
            <div className="relative group">
              {isLoggedIn && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                      <span className="material-icons text-sm mr-1">account_circle</span>
                      <span className="max-w-[120px] truncate">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#232e3d] text-white">
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#2e3b4e]" onClick={() => router.push('/profile')}>
                      <span className="material-icons text-sm mr-2">person</span>
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#2e3b4e]" onClick={() => router.push('/my-trips')}>
                      <span className="material-icons text-sm mr-2">schedule</span>
                      <span>My Trips</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-[#2e3b4e]" onClick={() => router.push('/wallet')}>
                      <span className="material-icons text-sm mr-2">account_balance_wallet</span>
                      <span>My Wallet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-[#2e3b4e]" onClick={handleLogout}>
                      <span className="material-icons text-sm mr-2">logout</span>
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  onClick={() => router.push('/login')}
                >
                  <span className="material-icons text-sm mr-1">person</span>
                  <span>Login or Create Account</span>
                </Button>
              )}
            </div>

            {/* Language and Currency */}
            <div className="hidden lg:flex items-center text-white space-x-2">
              <span>USD</span>
              <span className="text-white/50">|</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Visible on small screens */}
      <nav className="md:hidden bg-[#2e3b4e] text-white flex justify-around py-2">
        <Link href="/trains" className="flex flex-col items-center text-xs">
          <span className="material-icons">train</span>
          <span>Trains</span>
        </Link>
        <Link href="/flights" className="flex flex-col items-center text-xs">
          <span className="material-icons">flight</span>
          <span>Flights</span>
        </Link>
        <Link href="/hotels" className="flex flex-col items-center text-xs">
          <span className="material-icons">hotel</span>
          <span>Hotels</span>
        </Link>
        <Link href="/holidays" className="flex flex-col items-center text-xs">
          <span className="material-icons">beach_access</span>
          <span>Holidays</span>
        </Link>
        <Link href="/more" className="flex flex-col items-center text-xs">
          <span className="material-icons">more_horiz</span>
          <span>More</span>
        </Link>
      </nav>

      {/* AI Travel Planner Component */}
      {aiChatOpen && <AITravelPlanner onClose={() => setAiChatOpen(false)} />}
    </header>
  );
};

export default Header;
