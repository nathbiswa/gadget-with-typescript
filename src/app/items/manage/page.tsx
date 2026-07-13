'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@heroui/react";
import { authClient } from '@/lib/auth-client';
import { toast, ToastContainer } from 'react-toastify';
import Image from 'next/image';

interface ManagedItem {
    _id: string; // ডাটাবেজের আইডি সাধারণত _id হয়
    title: string;
    category: string;
    pricePerDay: number;
    status: 'Available' | 'Rented' | 'pending' | 'approved';
    totalRents?: number;
    images?: string[];
}

export default function ManageItemsPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [items, setItems] = useState<ManagedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

    // 📥 ইউজারের নিজস্ব ইনভেন্টরি ডাটা ফেচ করার লজিক
    const fetchUserItems = async (userId: string) => {
        try {
            // ব্যাকএন্ডের মেইন এপিআই থেকে ডাটা এনে ইউজারের আইডি দিয়ে ফিল্টার করছি
            const res = await fetch(`http://localhost:5000/api/gadgets`, {
                cache: 'no-store'
            });
            const json = await res.json();

            if (json.success && Array.isArray(json.data)) {
                // শুধুমাত্র বর্তমান ইউজারের আপলোড করা আইটেম ফিল্টার করা হচ্ছে
                // (নোট: আপনার ব্যাকএন্ডে ফিল্ডের নাম userId বা addedBy হতে পারে, সেটি মিলিয়ে নেবেন)
                const userOwnedItems = json.data.filter(
                    (item: any) => item.userId === userId || item.addedBy === userId
                );
                setItems(userOwnedItems);
            }
        } catch (error) {
            console.error('Failed to fetch items:', error);
            toast.error('ইনভেন্টরি ডাটা লোড করতে সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    // 🛡️ সিকিউরিটি এবং ইনিশিয়াল ডাটা লোড
    useEffect(() => {
        if (!isPending && !session?.user) {
            toast.error("Please login to manage your gear!", { autoClose: 3000 });
            router.push('/login');
            return;
        }

        if (session?.user?.id) {
            fetchUserItems(session.user.id);
        }
    }, [session, isPending, router]);

    // 🗑️ ডাটাবেজ থেকে আইটেম ডিলিট করার রিয়েল-টাইম লজিক
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this listing permanently?");
        if (!confirmDelete) return;

        setDeleteLoadingId(id);
        try {
            const res = await fetch(`http://localhost:5000/api/gadgets/${id}`, {
                method: 'DELETE',
            });
            const json = await res.json();

            if (json.success) {
                // সফল হলে রিয়েল-টাইমে স্টেট থেকে বাদ যাবে
                setItems(prevItems => prevItems.filter(item => item._id !== id));
                toast.success("🎉 Listing removed successfully!");
            } else {
                toast.error(json.message || "Failed to delete item.");
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
        } finally {
            setDeleteLoadingId(null);
        }
    };

    if (isPending || (session?.user && loading)) {
        return <div className="text-center py-20 text-gray-500 text-sm">Loading your gear matrix...</div>;
    }

    if (!session?.user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <ToastContainer position="top-center" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Management Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-100 pb-5">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Your Gear Inventory</h1>
                        <p className="mt-1 text-sm text-gray-500">Track your listed products, active rental statuses, or update listings.</p>
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
                                        <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">

                                            {/* Image + Title */}
                                            <td className="py-4 px-6 flex items-center space-x-4">
                                                <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
                                                    <Image
                                                        src={item.images?.[0] || "https://placehold.co/150"}
                                                        width={150}
                                                        height={150}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
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
                                                {item.totalRents || 0} times
                                            </td>

                                            {/* Conditional Status Badges */}
                                            <td className="py-4 px-6">
                                                <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full ${item.status === 'Available' || item.status === 'approved'
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : item.status === 'pending'
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {item.status === 'approved' ? 'Available' : item.status}
                                                </span>
                                            </td>

                                            {/* Dynamic Action Controls */}
                                            <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                                                {/* View Button: নির্দিষ্ট প্রোডাক্টের ডিটেইলস পেজে নিয়ে যাবে */}
                                                <Link href={`/items/${item._id}`}>
                                                    <Button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                                                        View
                                                    </Button>
                                                </Link>

                                                {/* Delete Button */}
                                                <Button
                                                    disabled={deleteLoadingId === item._id}
                                                    onClick={() => handleDelete(item._id)}
                                                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                                                >
                                                    {deleteLoadingId === item._id ? 'Deleting...' : 'Delete'}
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