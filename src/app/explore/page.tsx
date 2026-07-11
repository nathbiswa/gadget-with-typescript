'use client';

import { useState, useMemo } from 'react';
import { Gadget } from '@/types/gadget';
import GadgetCard from '@/components/GadgetCard';

// ১. আমাদের প্ল্যাটফর্মের জন্য বাস্তবসম্মত গ্যাজেট ডাটাবেজ লিস্ট
const allGadgets: Gadget[] = [
    {
        id: "1",
        title: "Sony Alpha 7 IV Mirrorless Camera",
        shortDescription: "33MP full-frame sensor, perfect for high-end wedding videography and professional photography.",
        fullDescription: "",
        images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop"],
        pricePerDay: 3500,
        rating: 4.9,
        location: "Dhaka",
        availableDate: "Available Now",
        category: "Cameras"
    },
    {
        id: "2",
        title: "DJI Mavic 3 Pro Drone",
        shortDescription: "Triple-camera system with 4K video recording, omnidirectional obstacle sensing, and 43 mins flight time.",
        fullDescription: "",
        images: ["https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=600&auto=format&fit=crop"],
        pricePerDay: 5000,
        rating: 4.8,
        location: "Chittagong",
        availableDate: "From July 12",
        category: "Drones"
    },
    {
        id: "3",
        title: "ASUS ROG Strix G16 Gaming Laptop",
        shortDescription: "Intel Core i9 13th Gen, 32GB RAM, RTX 4080 Graphics. Ideal for heavy gaming and 3D rendering.",
        fullDescription: "",
        images: ["https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=600&auto=format&fit=crop"],
        pricePerDay: 2500,
        rating: 4.7,
        location: "Dhaka",
        availableDate: "Available Now",
        category: "Laptops"
    },
    {
        id: "4",
        title: "Apple iPad Pro 12.9 M2",
        shortDescription: "Liquid Retina XDR display, M2 chip, 256GB storage. Great for digital artists and on-the-go video editing.",
        fullDescription: "",
        images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop"],
        pricePerDay: 1500,
        rating: 4.9,
        location: "Sylhet",
        availableDate: "From July 10",
        category: "Laptops"
    },
    {
        id: "5",
        title: "Premium Wireless Microphone Kit",
        shortDescription: "Dual-channel wireless microphone system for crystal clear audio recording, ideal for vlogging and interviews.",
        fullDescription: "",
        images: ["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop"],
        pricePerDay: 1000,
        rating: 4.6,
        location: "Dhaka",
        availableDate: "Available Now",
        category: "Audio"
    },
    {
        id: "6",
        title: "Action Camera Ultra HD 4K",
        shortDescription: "Waterproof action camera with HDR video, unbelievable stabilization, and extended battery life.",
        fullDescription: "",
        images: ["https://images.unsplash.com/photo-1565462522569-e70a7b6cf094?q=80&w=600&auto=format&fit=crop"],
        pricePerDay: 1200,
        rating: 4.8,
        location: "Chittagong",
        availableDate: "Available Now",
        category: "Cameras"
    }
];

export default function ExplorePage() {
    // ২. টাইপস্ক্রিপ্ট স্টেট ডিফাইন করা
    const [search, setSearch] = useState<string>('');
    const [category, setCategory] = useState<string>('All');
    const [location, setLocation] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('default');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const itemsPerPage = 4; // প্রতি পেজে ৪টি করে আইটেম দেখাব (Pagination Rule)

    // ৩. সার্চ, ফিল্টার এবং সর্টিং লজিক (useMemo ব্যবহার করা হয়েছে পারফরম্যান্সের জন্য)
    const filteredAndSortedGadgets = useMemo(() => {
        let result = [...allGadgets];

        // সার্চ ফিল্টারিং
        if (search.trim() !== '') {
            result = result.filter(item =>
                item.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        // ক্যাটাগরি ফিল্টারিং
        if (category !== 'All') {
            result = result.filter(item => item.category === category);
        }

        // লোকেশন ফিল্টারিং
        if (location !== 'All') {
            result = result.filter(item => item.location === location);
        }

        // সর্টিং লজিক
        if (sortBy === 'low-to-high') {
            result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        } else if (sortBy === 'high-to-low') {
            result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        } else if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [search, category, location, sortBy]);

    // ৪. পেজিনেরশন হিসাব-নিকাশ
    const totalPages = Math.ceil(filteredAndSortedGadgets.length / itemsPerPage);
    const displayedGadgets = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedGadgets.slice(start, start + itemsPerPage);
    }, [filteredAndSortedGadgets, currentPage]);

    // ফিল্টার চেঞ্জ হলে পেজ ১ এ রিসেট করার ফাংশন
    const handleFilterChange = (type: string, value: string) => {
        if (type === 'category') setCategory(value);
        if (type === 'location') setLocation(value);
        if (type === 'search') setSearch(value);
        if (type === 'sort') setSortBy(value);
        setCurrentPage(1); // যেকোনো ফিল্টার বদলালে পেজিনেশন আবার ১ম পেজে চলে যাবে
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* হেডার */}
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Rental Gear</h1>
                    <p className="text-gray-500 mt-1 text-sm">Find and book the best production equipment near you with flexible control.</p>
                </div>

                {/* 🔍 সার্চ, ফিল্টার এবং সর্টিং প্যানেল */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
                    {/* সার্চ বার */}
                    <div className="flex-grow">
                        <input
                            type="text"
                            placeholder="Search gadgets by title..."
                            value={search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* ক্যাটাগরি ফিল্টার */}
                    <div className="w-full md:w-48">
                        <select
                            value={category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            <option value="Cameras">Cameras</option>
                            <option value="Drones">Drones</option>
                            <option value="Laptops">Laptops</option>
                            <option value="Audio">Audio</option>
                        </select>
                    </div>

                    {/* লোকেশন ফিল্টার */}
                    <div className="w-full md:w-48">
                        <select
                            value={location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="All">All Locations</option>
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Sylhet">Sylhet</option>
                        </select>
                    </div>

                    {/* সর্টিং অপশন */}
                    <div className="w-full md:w-48">
                        <select
                            value={sortBy}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="default">Sort By</option>
                            <option value="low-to-high">Price: Low to High</option>
                            <option value="high-to-low">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                {/* 📦 প্রোডাক্ট লিস্ট গ্রিড (ডেক্সটপে ৪টি কলাম) */}
                {displayedGadgets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {displayedGadgets.map((gadget) => (
                            <GadgetCard key={gadget.id} gadget={gadget} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm mb-10">
                        <p className="text-gray-400 text-lg">No gadgets found matching your criteria.</p>
                    </div>
                )}

                {/* 📑 পেজিনেশন কন্ট্রোল বাটন */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-600 transition-colors cursor-pointer"
                        >
                            Previous
                        </button>

                        <span className="text-sm font-semibold text-gray-700 px-4">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-600 transition-colors cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}