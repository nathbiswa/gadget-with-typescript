'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// বুকিং ডাটার টাইপ ডেফিনিশন
interface PopulatedBooking {
    _id: string;
    userId: string;
    userEmail: string;
    startDate: string;
    endDate: string;
    totalCost: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
    gadgetId: {
        _id: string;
        title: string;
        images: string[];
        category: string;
        pricePerDay: number;
    } | null;
}

// 🗓️ তারিখ সুন্দরভাবে দেখানোর জন্য হেল্পার ফাংশন (e.g., 2026-07-13 -> Jul 13, 2026)
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// 🎨 স্ট্যাটাস অনুযায়ী ব্যাজের আলাদা আলাদা কালার ম্যাপিং
const statusStyles: Record<PopulatedBooking['status'], string> = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
    completed: 'bg-green-50 text-green-700 border border-green-200',
    cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
};

export default function UserDashboard() {
    const [bookings, setBookings] = useState<PopulatedBooking[]>([]);
    const [loading, setLoading] = useState(true);

    // Better Auth থেকে কারেন্ট ইউজার আইডি (আপাতত আগের টেস্ট আইডি ব্যবহার করছি)
    // 💡 টিপস: Better Auth ব্যবহার করলে এখানে const { data: session } = auth.useSession(); থেকে session.user.id পাবেন।
    const currentUserId = "auth_user_123";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/bookings/user/${currentUserId}`, {
                    cache: 'no-store'
                });
                const json = await res.json();
                if (json.success) {
                    setBookings(json.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUserId) {
            fetchDashboardData();
        }
    }, [currentUserId]);

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            {/* ড্যাশবোর্ড হেডার */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-800 mb-2">Welcome Back!</h1>
                <p className="text-gray-500 text-sm">Manage your rented premium gear and tracking status.</p>
            </div>

            {/* রেন্টাল হিস্ট্রি সেকশন */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6">My Rental History</h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-gray-400 font-medium text-sm">Loading your rental history...</div>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="pb-4">Gear Info</th>
                                    <th className="pb-4">Lease Period</th>
                                    <th className="pb-4">Total Cost</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {bookings.map((booking) => {
                                    const gadget = booking.gadgetId;
                                    return (
                                        <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                                            {/* ১. গ্যাজেট ইনফো (ইমেজ + টাইটেল) */}
                                            <td className="py-4 flex items-center gap-4">
                                                <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                    <Image
                                                        src={gadget && gadget.images?.length > 0 ? gadget.images[0] : 'https://placehold.co/100'}
                                                        width={100}
                                                        height={100}
                                                        alt={gadget?.title || "Deleted Gadget"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 line-clamp-1 max-w-[250px]">
                                                        {gadget?.title || "Unknown Gadget"}
                                                    </h4>
                                                    <span className="bg-gray-100 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 inline-block">
                                                        {gadget?.category || "N/A"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* ২. লিজের মেয়াদ */}
                                            <td className="py-4 text-gray-600 font-semibold">
                                                <div className="text-xs text-gray-700">{formatDate(booking.startDate)}</div>
                                                <div className="text-gray-400 text-[10px] my-0.5 uppercase tracking-wider font-bold">to</div>
                                                <div className="text-xs text-gray-700">{formatDate(booking.endDate)}</div>
                                            </td>

                                            {/* ৩. মোট খরচ */}
                                            <td className="py-4 font-black text-indigo-600 text-base">
                                                ৳{booking.totalCost.toLocaleString('en-IN')}
                                            </td>

                                            {/* ৪. স্ট্যাটাস ব্যাজ */}
                                            <td className="py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[booking.status] || 'bg-gray-50 text-gray-600'}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                                                    {booking.status.toUpperCase()}
                                                </span>
                                            </td>

                                            {/* ৫. অ্যাকশন বাটন (View Details) */}
                                            <td className="py-4 text-right">
                                                {gadget ? (
                                                    <Link
                                                        href={`/explore/${gadget._id}`}
                                                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-3 py-2 rounded-lg transition"
                                                    >
                                                        View Gear
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">Unavailable</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                        <p className="text-gray-400 text-sm mb-4 font-medium">You haven't rented any gear yet.</p>
                        <Link
                            href="/explore"
                            className="bg-indigo-600 text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-indigo-700 transition inline-block shadow-sm shadow-indigo-100"
                        >
                            Browse Premium Gear
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}


// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { Button } from "@heroui/react";

// // Define strict TypeScript type for dashboard tabs
// type DashboardTab = 'rentals' | 'listings';

// export default function DashboardPage() {
//     const [activeTab, setActiveTab] = useState<DashboardTab>('rentals');

//     // Realistic mock data for gadgets currently rented BY the user
//     const myRentals = [
//         {
//             id: "r1",
//             title: "Sony Alpha 7 IV Mirrorless Camera",
//             pricePerDay: 3500,
//             dueDate: "July 15, 2026",
//             status: "Active",
//             img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop"
//         },
//         {
//             id: "r2",
//             title: "Rode Wireless GO II Microphone",
//             pricePerDay: 1000,
//             dueDate: "July 12, 2026",
//             status: "Expiring Soon",
//             img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400&auto=format&fit=crop"
//         }
//     ];

//     // Realistic mock data for gadgets listed FOR RENT by the user
//     const myListings = [
//         {
//             id: "l1",
//             title: "DJI Mavic 3 Pro Drone",
//             pricePerDay: 5000,
//             totalEarnings: 15000,
//             status: "Listed",
//             img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=400&auto=format&fit=crop"
//         }
//     ];

//     return (
//         <div className="min-h-screen bg-gray-50 py-10">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//                 {/* Profile Overview Banner */}
//                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
//                     <div className="flex items-center space-x-4">
//                         <div className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
//                             JD
//                         </div>
//                         <div>
//                             <h1 className="text-xl font-extrabold text-gray-900">John Doe</h1>
//                             <p className="text-sm text-gray-400">Verified Member since 2025 • user@gadgetlease.com</p>
//                         </div>
//                     </div>

//                     {/* HeroUI styled action link to quickly add gear */}
//                     <Link href="/items/add">
//                         <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer">
//                             + List New Gear
//                         </Button>
//                     </Link>
//                 </div>

//                 {/* Tab Navigation Switches */}
//                 <div className="flex border-b border-gray-200 mb-6 gap-6">
//                     <button
//                         onClick={() => setActiveTab('rentals')}
//                         className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'rentals'
//                             ? 'border-indigo-600 text-indigo-600'
//                             : 'border-transparent text-gray-400 hover:text-gray-600'
//                             }`}
//                     >
//                         My Rentals ({myRentals.length})
//                     </button>
//                     <button
//                         onClick={() => setActiveTab('listings')}
//                         className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'listings'
//                             ? 'border-indigo-600 text-indigo-600'
//                             : 'border-transparent text-gray-400 hover:text-gray-600'
//                             }`}
//                     >
//                         My Gear Listings ({myListings.length})
//                     </button>
//                 </div>

//                 {/* Render Active Tab Condition */}
//                 {activeTab === 'rentals' ? (
//                     /* MY RENTALS GRID */
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {myRentals.map((item) => (
//                             <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden flex shadow-sm p-4 gap-4 items-center">
//                                 <div className="h-24 w-24 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
//                                     <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
//                                 </div>
//                                 <div className="flex-grow">
//                                     <h3 className="text-gray-900 font-bold text-base line-clamp-1">{item.title}</h3>
//                                     <p className="text-xs text-gray-400 mt-0.5">Rate: ৳{item.pricePerDay}/day</p>
//                                     <div className="mt-3 flex items-center justify-between">
//                                         <span className="text-xs font-semibold text-gray-500">Return Due: <strong className="text-gray-700">{item.dueDate}</strong></span>
//                                         <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
//                                             }`}>
//                                             {item.status}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     /* MY LISTINGS GRID */
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {myListings.map((item) => (
//                             <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden flex shadow-sm p-4 gap-4 items-center">
//                                 <div className="h-24 w-24 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
//                                     <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
//                                 </div>
//                                 <div className="flex-grow">
//                                     <h3 className="text-gray-900 font-bold text-base line-clamp-1">{item.title}</h3>
//                                     <p className="text-xs text-gray-400 mt-0.5">Listed Rate: ৳{item.pricePerDay}/day</p>
//                                     <div className="mt-3 flex items-center justify-between">
//                                         <span className="text-xs font-semibold text-indigo-600 bg-indigo-50/50 px-2.5 py-1 rounded-lg">Total Earned: ৳{item.totalEarnings}</span>
//                                         <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
//                                             {item.status}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//             </div>
//         </div>
//     );
// };