'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@heroui/react";

// Strict TypeScript structure for listed gear items
interface ManagedItem {
    id: string;
    title: string;
    category: string;
    pricePerDay: number;
    status: 'Available' | 'Rented';
    totalRents: number;
    img: string;
}

export default function ManageItemsPage() {
    // Mock state data to simulate database listings
    const [items, setItems] = useState<ManagedItem[]>([
        {
            id: "1",
            title: "Sony Alpha 7 IV Mirrorless Camera",
            category: "Cameras",
            pricePerDay: 3500,
            status: "Available",
            totalRents: 12,
            img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=150&auto=format&fit=crop"
        },
        {
            id: "2",
            title: "DJI Mavic 3 Pro Drone",
            category: "Drones",
            pricePerDay: 5000,
            status: "Rented",
            totalRents: 8,
            img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=150&auto=format&fit=crop"
        },
        {
            id: "3",
            title: "ASUS ROG Strix G16 Gaming Laptop",
            category: "Laptops",
            pricePerDay: 2500,
            status: "Available",
            totalRents: 5,
            img: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=150&auto=format&fit=crop"
        }
    ]);

    // Handle immediate item deletion from client state
    const handleDelete = (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this listing permanently?");
        if (confirmDelete) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Management Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-100 pb-5">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Your Gear Inventory</h1>
                        <p className="mt-1 text-sm text-gray-500">Edit prices, track active rental statuses, or update your listed gear.</p>
                    </div>
                    <Link href="/items/add">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer">
                            + Add New Listing
                        </Button>
                    </Link>
                </div>

                {/* 📊 Inventory Dashboard Data Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <th className="py-4 px-6">Item Details</th>
                                    <th className="py-4 px-6">Category</th>
                                    <th className="py-4 px-6">Price / Day</th>
                                    <th className="py-4 px-6">Total Rented</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">

                                            {/* Image + Title */}
                                            <td className="py-4 px-6 flex items-center space-x-4">
                                                <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
                                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-bold text-gray-800 line-clamp-1 max-w-xs">{item.title}</span>
                                            </td>

                                            {/* Category */}
                                            <td className="py-4 px-6 text-gray-500 font-medium">
                                                {item.category}
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-6 font-bold text-indigo-600">
                                                ৳{item.pricePerDay}
                                            </td>

                                            {/* Total Rented Analytics */}
                                            <td className="py-4 px-6 text-gray-600 font-semibold">
                                                {item.totalRents} times
                                            </td>

                                            {/* Conditional Status Badges */}
                                            <td className="py-4 px-6">
                                                <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full ${item.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>

                                            {/* Dynamic Action Controls */}
                                            <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                                                <Button
                                                    onClick={() => alert(`Redirecting to edit page for ID: ${item.id}`)}
                                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                                >
                                                    Delete
                                                </Button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-gray-400 font-medium bg-white">
                                            Your gear inventory is completely empty. Start by adding an item!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}