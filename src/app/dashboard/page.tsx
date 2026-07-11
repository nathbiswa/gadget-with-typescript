'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@heroui/react";

// Define strict TypeScript type for dashboard tabs
type DashboardTab = 'rentals' | 'listings';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<DashboardTab>('rentals');

    // Realistic mock data for gadgets currently rented BY the user
    const myRentals = [
        {
            id: "r1",
            title: "Sony Alpha 7 IV Mirrorless Camera",
            pricePerDay: 3500,
            dueDate: "July 15, 2026",
            status: "Active",
            img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop"
        },
        {
            id: "r2",
            title: "Rode Wireless GO II Microphone",
            pricePerDay: 1000,
            dueDate: "July 12, 2026",
            status: "Expiring Soon",
            img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400&auto=format&fit=crop"
        }
    ];

    // Realistic mock data for gadgets listed FOR RENT by the user
    const myListings = [
        {
            id: "l1",
            title: "DJI Mavic 3 Pro Drone",
            pricePerDay: 5000,
            totalEarnings: 15000,
            status: "Listed",
            img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=400&auto=format&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile Overview Banner */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                            JD
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900">John Doe</h1>
                            <p className="text-sm text-gray-400">Verified Member since 2025 • user@gadgetlease.com</p>
                        </div>
                    </div>

                    {/* HeroUI styled action link to quickly add gear */}
                    <Link href="/items/add">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer">
                            + List New Gear
                        </Button>
                    </Link>
                </div>

                {/* Tab Navigation Switches */}
                <div className="flex border-b border-gray-200 mb-6 gap-6">
                    <button
                        onClick={() => setActiveTab('rentals')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'rentals'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        My Rentals ({myRentals.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('listings')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'listings'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        My Gear Listings ({myListings.length})
                    </button>
                </div>

                {/* Render Active Tab Condition */}
                {activeTab === 'rentals' ? (
                    /* MY RENTALS GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myRentals.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden flex shadow-sm p-4 gap-4 items-center">
                                <div className="h-24 w-24 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-gray-900 font-bold text-base line-clamp-1">{item.title}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Rate: ৳{item.pricePerDay}/day</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-500">Return Due: <strong className="text-gray-700">{item.dueDate}</strong></span>
                                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* MY LISTINGS GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myListings.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden flex shadow-sm p-4 gap-4 items-center">
                                <div className="h-24 w-24 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-gray-900 font-bold text-base line-clamp-1">{item.title}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Listed Rate: ৳{item.pricePerDay}/day</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50/50 px-2.5 py-1 rounded-lg">Total Earned: ৳{item.totalEarnings}</span>
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};