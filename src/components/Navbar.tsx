'use client'; // রিয়্যাক্টের ইন্টারঅ্যাক্টিভিটি (যেমন মোবাইল মেনু টগল) এর জন্য লাগে

import { useState } from 'react';
import Link from 'next/link';

// ১. টাইপস্ক্রিপ্ট ইন্টারফেস তৈরি
interface NavItem {
  label: string;
  path: string;
}

export default function Navbar() {
  // মোবাইল মেনু ওপেন/ক্লোজ করার স্টেট (boolean টাইপ)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // আমরা আপাতত ধরে নিচ্ছি ইউজার লগইন অবস্থায় আছে (পরে এটাকে আমরা আসল ডাটা দিয়ে পরিবর্তন করব)
  const isLoggedIn = true; 

  // ২. রিকোয়ারমেন্ট অনুযায়ী রুট বা মেনু ঠিক করা
  // লগআউট থাকলে ৩টি, লগইন থাকলে ৫টি মেনু দেখাবে
  const routes: NavItem[] = isLoggedIn
    ? [
        { label: 'Home', path: '/' },
        { label: 'Explore Gadgets', path: '/explore' },
        { label: 'Add Item', path: '/items/add' },
        { label: 'Manage Items', path: '/items/manage' },
        { label: 'Dashboard', path: '/dashboard' },
      ]
    : [
        { label: 'Home', path: '/' },
        { label: 'Explore', path: '/explore' },
        { label: 'Login', path: '/login' },
      ];

  return (
    // full-width background এবং sticky পজিশন (রিকোয়ারমেন্ট ৩)
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* লোগো */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Gadget<span className="text-gray-800">Lease</span>
            </Link>
          </div>

          {/* ডেক্সটপ মেনু (বড় স্ক্রিনের জন্য) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {routes.map((route, index) => (
                <Link
                  key={index}
                  href={route.path}
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>

          {/* মোবাইল মেনু বাটন (ছোট স্ক্রিনের জন্য হামবার্গার আইকন) */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* আইকন টগল */}
              {isOpen ? (
                <span className="text-xl font-bold px-2">✕</span>
              ) : (
                <span className="text-xl font-bold px-1">☰</span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* মোবাইল ড্রপডাউন মেনু (ক্লিক করলে দেখাবে) */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {routes.map((route, index) => (
              <Link
                key={index}
                href={route.path}
                onClick={() => setIsOpen(false)} // মেনু ক্লিক করলে ড্রপডাউন বন্ধ হবে
                className="text-gray-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}