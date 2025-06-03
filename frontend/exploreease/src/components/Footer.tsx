import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-ee-ash-800 pt-10 pb-5">
      <div className="container mx-auto px-4">
        {/* Main Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-10">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-300 mb-4">Why <span className="text-ee-orange-500">Explore</span>Ease?</h3>
            <p className="text-sm text-gray-400 mb-4">
              ExploreEase offers a seamless booking experience powered by AI technology.
              From flights and hotels to trains and holidays, we provide competitive rates, exclusive discounts, and
              a hassle-free booking process. Our AI-powered travel planner helps you make the most of your journey
              with personalized recommendations and smart itineraries tailored to your preferences.
            </p>
          </div>

          {/* Train Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-300 mb-4">Train Booking with ExploreEase</h3>
            <p className="text-sm text-gray-400 mb-4">
              Book IRCTC train tickets easily with our platform. Use our prediction feature to increase your chances
              of getting confirmed seats. We support General, Tatkal, and Ladies quota bookings. Get instant refunds
              on cancellations and enjoy 24/7 customer support for all your train travel needs. Our same-train alternates
              feature suggests the best booking options for your journey.
            </p>
          </div>

          {/* Flight Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-300 mb-4">Flight & Hotel Bookings</h3>
            <p className="text-sm text-gray-400 mb-4">
              Find the best deals on flights and hotels worldwide with ExploreEase. Our platform offers affordable
              and customized booking options to suit your convenience. With our 24/7 dedicated helpline, we're
              always ready to assist with your queries. Serving millions of happy customers, we strive to fulfill
              your travel dreams with quick and easy booking solutions.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <h5 className="text-sm font-semibold uppercase text-gray-400 mb-4">TRAINS</h5>
            <ul className="space-y-2">
              <li><Link href="/trains" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">IRCTC Train Tickets</Link></li>
              <li><Link href="/trains/tatkal" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Tatkal Booking</Link></li>
              <li><Link href="/pnr-status" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">PNR Status</Link></li>
              <li><Link href="/train-running-status" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Train Running Status</Link></li>
              <li><Link href="/train-schedule" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Train Schedule</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold uppercase text-gray-400 mb-4">FLIGHTS</h5>
            <ul className="space-y-2">
              <li><Link href="/flights/domestic" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Domestic Flights</Link></li>
              <li><Link href="/flights/international" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">International Flights</Link></li>
              <li><Link href="/flights/cheap-flights" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Cheap Flight Tickets</Link></li>
              <li><Link href="/flights/airlines" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Airlines</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold uppercase text-gray-400 mb-4">HOTELS</h5>
            <ul className="space-y-2">
              <li><Link href="/hotels/domestic" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Domestic Hotels</Link></li>
              <li><Link href="/hotels/international" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">International Hotels</Link></li>
              <li><Link href="/hotels/deals" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Hotel Deals</Link></li>
              <li><Link href="/hotels/reviews" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Hotel Reviews</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold uppercase text-gray-400 mb-4">ABOUT</h5>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">About Us</Link></li>
              <li><Link href="/contact-us" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Contact Us</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Careers</Link></li>
              <li><Link href="/affiliates" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Affiliate Program</Link></li>
              <li><Link href="/ai-travel-planner" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">AI Travel Planner</Link></li>
            </ul>
          </div>
        </div>

        {/* Site Info */}
        <div className="border-t border-gray-800 pt-6 pb-4">
          <h5 className="text-sm font-semibold uppercase text-gray-400 mb-4">LEGAL INFORMATION</h5>
          <div className="flex flex-wrap gap-2">
            <Link href="/contact-us" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Contact Us</Link>
            <span className="text-gray-600">•</span>
            <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Privacy Policy</Link>
            <span className="text-gray-600">•</span>
            <Link href="/cookie-policy" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Cookie Policy</Link>
            <span className="text-gray-600">•</span>
            <Link href="/user-agreement" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">User Agreement</Link>
            <span className="text-gray-600">•</span>
            <Link href="/terms-of-service" className="text-sm text-gray-500 hover:text-ee-orange-500 transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-6 my-6">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ee-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ee-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ee-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ee-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} <span className="text-gray-400">Explore</span><span className="text-ee-orange-500">Ease</span> - Your AI-Powered Travel Companion
        </div>
      </div>
    </footer>
  );
};

export default Footer;
