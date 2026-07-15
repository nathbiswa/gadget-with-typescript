'use client';

import { useEffect, useState } from 'react';
import { Gadget } from '@/types/gadget';
import GadgetCard from '@/components/GadgetCard';

export default function ExplorePage() {
    const [gadgets, setGadgets] = useState<Gadget[]>([]);
    const [loading, setLoading] = useState(true);

    // ফিল্টার স্টেটসমূহ
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // এপিআই থেকে ডাটা ফেচ করার ফাংশন
    const fetchGadgets = async () => {
        setLoading(true);
        try {
            // ১. একটি ডাইনামিক অবজেক্ট তৈরি করুন
            const params: Record<string, string> = {
                sortBy,
                order,
                page: page.toString(),
                limit: '6'
            };

            // ২. শুধুমাত্র ভ্যালু থাকলেই কুয়েরিতে যোগ করুন (খালি স্ট্রিং বাদ যাবে)
            if (search.trim()) params.search = search;
            if (category) params.category = category;
            if (maxPrice) params.maxPrice = maxPrice;

            const queryParams = new URLSearchParams(params);

            console.log("Fetching from URL:", `https://gadgetlease-server.onrender.com/api/gadgets?${queryParams.toString()}`); // 💡 ডিবাগিং এর জন্য

            const res = await fetch(`https://gadgetlease-server.onrender.com/api/gadgets?${queryParams.toString()}`);
            const json = await res.json();

            if (json.success) {
                setGadgets(json.data);
                // 💡 মেটা ডাটা বা টোটাল পেজ অপশনাল চেইনিং দিয়ে সেফ রাখুন
                setTotalPages(json.meta?.totalPages || 1);
            } else {
                setGadgets([]);
            }
        } catch (error) {
            console.error('Failed to fetch gadgets', error);
            setGadgets([]); // এরর খেলে স্টেট খালি করে দিন
        } finally {
            setLoading(false);
        }
    };
    // const fetchGadgets = async () => {
    //     setLoading(true);
    //     try {
    //         // কুয়েরি স্ট্রিং তৈরি করা হচ্ছে
    //         const queryParams = new URLSearchParams({
    //             search,
    //             category,
    //             maxPrice,
    //             sortBy,
    //             order,
    //             page: page.toString(),
    //             limit: '6' // প্রতি পেজে ৬টি করে কার্ড দেখাবে
    //         });

    //         const res = await fetch(`https://gadgetlease-server.onrender.com/api/gadgets?${queryParams.toString()}`);
    //         const json = await res.json();
    //         if (json.success) {
    //             setGadgets(json.data);
    //             setTotalPages(json.meta.totalPages);
    //         }
    //     } catch (error) {
    //         console.error('Failed to fetch gadgets', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // যখনই কোনো ফিল্টার বা পেজ চেঞ্জ হবে, তখনই ডাটা রি-লোড হবে
    useEffect(() => {
        fetchGadgets();
    }, [search, category, maxPrice, sortBy, order, page]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-black text-gray-800 mb-8">Explore Rental Gadgets</h1>

            {/* 🛠️ ফিল্টার এবং সার্চ বার প্যানেল */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">

                {/* ১. সার্চ ইনপুট */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-400 mb-1.5 uppercase">Search</label>
                    <input
                        type="text"
                        placeholder="Search cameras, drones..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="bg-white border border-gray-200 text-sm rounded-xl p-3 focus:outline-indigo-500"
                    />
                </div>

                {/* ২. ক্যাটাগরি ফিল্টার (Field 1) */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-400 mb-1.5 uppercase">Category</label>
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="bg-white border border-gray-200 text-sm rounded-xl p-3 focus:outline-indigo-500"
                    >
                        <option value="">All Categories</option>
                        <option value="Camera">Camera</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Drone">Drone</option>
                        <option value="Lens">Lens</option>
                        <option value="Gaming">Gaming</option>
                    </select>
                </div>

                {/* ৩. প্রাইস ফিল্টার (Field 2) */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-400 mb-1.5 uppercase">Max Price (৳/day)</label>
                    <input
                        type="number"
                        placeholder="e.g. 50"
                        value={maxPrice}
                        onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                        className="bg-white border border-gray-200 text-sm rounded-xl p-3 focus:outline-indigo-500"
                    />
                </div>

                {/* ৪. সর্টিং অপশন (Sort By) */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-400 mb-1.5 uppercase">Sort By</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white border border-gray-200 text-sm rounded-xl p-3 focus:outline-indigo-500"
                    >
                        <option value="createdAt">Release Date</option>
                        <option value="pricePerDay">Price</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>

                {/* ৫. অর্ডার (Ascending/Descending) */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-400 mb-1.5 uppercase">Order</label>
                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="bg-white border border-gray-200 text-sm rounded-xl p-3 focus:outline-indigo-500"
                    >
                        <option value="desc">High to Low / Newest</option>
                        <option value="asc">Low to High / Oldest</option>
                    </select>
                </div>
            </div>

            {/* 📦 গ্যাজেট গ্রিড সেকশন */}
            {loading ? (
                <div className="text-center py-20 text-gray-400 font-medium">Loading premium gear...</div>
            ) : gadgets.length > 0 ? (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {gadgets.map((gadget) => (
                            <GadgetCard key={gadget._id} gadget={gadget} />
                        ))}
                    </div>

                    {/* 📄 পেজিনেশন বাটনসমূহ */}
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-bold text-gray-500">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-gray-400 border border-dashed rounded-2xl">
                    😞 No gadgets found matching your filters. Try adjusting them!
                </div>
            )}
        </div>
    );
}


// import GadgetCard from '@/components/GadgetCard';
// import { Gadget } from '@/types/gadget';

// export default async function ExplorePage() {

//     // সব গ্যাজেট আনার এপিআই কল
//     const res = await fetch(`${https://gadgetlease-server.onrender.com}/api/gadgets`, {
//         cache: 'no-store' // সবসময় একদম লেটেস্ট ডাটা দেখাবে
//     });

//     const result = await res.json();
//     const allGadgets: Gadget[] = result.data || [];
//     console.log('All Gadgets:', allGadgets); // ডাটা কনসোল লগে দেখানো হচ্ছে

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-4xl font-bold mb-8">Explore All Gadgets</h1>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//                 {allGadgets.map((gadget) => (
//                     <GadgetCard key={gadget._id} gadget={gadget} />
//                 ))}
//             </div>
//         </div>
//     );
// }