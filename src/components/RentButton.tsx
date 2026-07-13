'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';

interface RentButtonProps {
    gadgetId: string;
    pricePerDay: number;
}

export default function RentButton({ gadgetId, pricePerDay }: RentButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 🎯 কাস্টম হুকটি কম্পোনেন্টের শুরুতে নিয়ে আসা হলো
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const handleRent = async () => {
        // 🔒 ইউজার লগইন না থাকলে সরাসরি লগইন পেজে পাঠিয়ে দেবে
        if (!user) {
            toast.warn("Please login to rent this gadget!");
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                gadgetId,
                userId: user.id,
                userEmail: user.email,
                startDate: new Date().toISOString().split('T')[0], // আজকের তারিখ
                endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // ৩ দিন পরের তারিখ
                totalCost: pricePerDay * 3 // ৩ দিনের মোট খরচ
            };

            const res = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            const json = await res.json();
            if (json.success) {
                toast.success('🎉 ' + json.message);
                router.push('/dashboard'); // বুকিং শেষে ড্যাশবোর্ডে রিডাইরেক্ট
            } else {
                toast.error('❌ ' + json.message);
            }
        } catch (error) {
            console.error('Booking failed:', error);
            toast.error('বুকিং করতে সমস্যা হয়েছে।');
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

// // src/components/RentButton.tsx
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { authClient } from '@/lib/auth-client';

// interface RentButtonProps {
//     gadgetId: string;
//     pricePerDay: number;
// }

// export default function RentButton({ gadgetId, pricePerDay }: RentButtonProps) {
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const handleRent = async () => {
//         setLoading(true);
//         try {

//             const { data: session } = authClient.useSession();
//             const user = session?.user;
//             console.log("User:", user);
//             if (!user) {
//                 router.push('/login');
//                 return;
//             }
//             const currentUser = {
//                 id: user.id,
//                 email: user.email
//             };
//             const bookingData = {
//                 gadgetId,
//                 userId: currentUser.id,
//                 userEmail: currentUser.email,
//                 startDate: new Date().toISOString().split('T')[0], // আজকের তারিখ
//                 endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // ৩ দিন পরের তারিখ
//                 totalCost: pricePerDay * 3 // ধরি ৩ দিনের জন্য লিজ নেওয়া হচ্ছে
//             };

//             const res = await fetch('http://localhost:5000/api/bookings', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(bookingData)
//             });

//             const json = await res.json();
//             if (json.success) {
//                 alert('🎉 ' + json.message);
//                 router.push('/dashboard'); // বুকিং শেষে ড্যাশবোর্ডে রিডাইরেক্ট
//             } else {
//                 alert('❌ ' + json.message);
//             }
//         } catch (error) {
//             console.error('Booking failed:', error);
//             alert('বুকিং করতে সমস্যা হয়েছে।');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <button
//             onClick={handleRent}
//             disabled={loading}
//             className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg disabled:opacity-50"
//         >
//             {loading ? 'Processing Lease...' : 'Rent This Gadget (For 3 Days)'}
//         </button>
//     );
// }