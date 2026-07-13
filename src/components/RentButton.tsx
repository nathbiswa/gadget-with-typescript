// src/components/RentButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RentButtonProps {
    gadgetId: string;
    pricePerDay: number;
}

export default function RentButton({ gadgetId, pricePerDay }: RentButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRent = async () => {
        setLoading(true);
        try {
            // 🎯 Better Auth থেকে কারেন্ট ইউজার নেওয়ার লজিক (আপনার প্রোজেক্টের Auth সেটআপ অনুযায়ী)
            // এখানে ডামি হিসেবে একটি ইউজার আইডি ও ইমেইল পাঠানো হচ্ছে, আপনি আপনার auth স্টেট থেকে এটি নেবেন
            const currentUser = {
                id: "auth_user_123",
                email: "user@example.com"
            };

            const bookingData = {
                gadgetId,
                userId: currentUser.id,
                userEmail: currentUser.email,
                startDate: new Date().toISOString().split('T')[0], // আজকের তারিখ
                endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // ৩ দিন পরের তারিখ
                totalCost: pricePerDay * 3 // ধরি ৩ দিনের জন্য লিজ নেওয়া হচ্ছে
            };

            const res = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            const json = await res.json();
            if (json.success) {
                alert('🎉 ' + json.message);
                router.push('/dashboard'); // বুকিং শেষে ড্যাশবোর্ডে রিডাইরেক্ট
            } else {
                alert('❌ ' + json.message);
            }
        } catch (error) {
            console.error('Booking failed:', error);
            alert('বুকিং করতে সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleRent}
            disabled={loading}
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg disabled:opacity-50"
        >
            {loading ? 'Processing Lease...' : 'Rent This Gadget (For 3 Days)'}
        </button>
    );
}