// src/app/explore/[id]/page.tsx

import RentButton from '@/components/RentButton';
import { Gadget } from '@/types/gadget';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toast } from 'react-toastify';

interface ParamProps {
    params: Promise<{ id: string }>;
}

export default async function GadgetDetailsPage({ params }: ParamProps) {
    // Next.js-এর নিয়ম অনুযায়ী params আনবক্স করা হচ্ছে
    const { id } = await params;

    // ব্যাকএন্ড থেকে সিঙ্গেল গ্যাজেটের ডাটা আনা হচ্ছে
    const res = await fetch(`https://gadgetlease-server.onrender.com/api/gadgets/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        toast.error('Failed to fetch gadget details. Please try again later.');
        notFound(); // যদি ডাটা না পায় তবে ৪MD ৪ পেজে নিয়ে যাবে
    }

    const result = await res.json();
    const gadget: Gadget = result.data;

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            {/* Back Button */}
            <Link href="/explore" className="text-indigo-600 font-medium text-sm hover:underline mb-6 inline-block">
                ← Back to Explore
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                {/* বাম পাশ: ইমেজ সেকশন */}
                <div>
                    <div className="relative h-96 w-full rounded-xl overflow-hidden bg-gray-50">
                        <Image
                            src={gadget.images && gadget.images.length > 0 ? gadget.images[0] : 'https://placehold.co/600x400'}
                            alt={gadget.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* যদি একাধিক ইমেজ থাকে তবে থাম্বনেইল দেখানোর জন্য (ঐচ্ছিক) */}
                    <div className="flex gap-3 mt-4">
                        {gadget.images?.map((img, index) => (
                            <div key={index} className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200">
                                <Image src={img} alt="image.title" width={400} height={400} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ডান পাশ: গ্যাজেট ইনফরমেশন */}
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                                {gadget.category}
                            </span>
                            <span className="text-amber-500 font-bold text-sm">⭐ {gadget.rating?.toFixed(1)}</span>
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{gadget.title}</h1>
                        <p className="text-gray-400 text-xs mb-4">📍 {gadget.location} | 📅 Available from: {gadget.availableDate}</p>

                        <div className="mb-6">
                            <span className="text-2xl font-black text-indigo-600">৳{gadget.pricePerDay}</span>
                            <span className="text-gray-400 text-sm"> / day</span>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h3 className="text-gray-800 font-bold mb-2">Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{gadget.fullDescription}</p>
                        </div>

                        {/* Specifications */}
                        <div className="border-t border-gray-100 pt-4 mt-4">
                            <h3 className="text-gray-800 font-bold mb-2">Specifications</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {gadget.specifications?.map((spec, index) => (
                                    <div key={index} className="bg-gray-50 p-2 rounded-lg text-xs">
                                        <span className="text-gray-400 block">{spec.label}</span>
                                        <span className="text-gray-700 font-semibold">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Rent Button */}
                    <RentButton gadgetId={(gadget as any)._id} pricePerDay={gadget.pricePerDay} />
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-gray-800 font-bold text-xl mb-4">User Reviews</h3>
                {gadget.reviews && gadget.reviews.length > 0 ? (
                    <div className="space-y-4">
                        {gadget.reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-semibold text-sm text-gray-700">{review.reviewerName}</h4>
                                    <span className="text-xs text-gray-400">{review.date}</span>
                                </div>
                                <div className="text-amber-400 text-xs mb-1">{"⭐".repeat(review.rating)}</div>
                                <p className="text-gray-600 text-sm">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">No reviews yet for this item.</p>
                )}
            </div>
        </div>
    );
}




// 'use client';

// import { useState } from 'react';
// import { Gadget } from '@/types/gadget';
// import Link from 'next/link';

// // ১. ডামি ডাটা (বাস্তবসম্মত ডাটা, কোনো লরেম ইপসাম নেই)
// const singleGadgetData: Gadget = {
//     id: "1",
//     title: "Sony Alpha 7 IV Mirrorless Camera",
//     shortDescription: "33MP full-frame sensor, perfect for high-end wedding videography and professional photography.",
//     fullDescription: "The Sony Alpha 7 IV is the ideal hybrid mirrorless camera, delivering breathtaking 33MP still images and cinematic 4K 60p video recording. Whether you are shooting a premium wedding film, a commercial project, or high-end portraits, this camera offers unmatched autofocus speed, exceptional low-light performance, and 10-bit color depth to make your visuals stand out.",
//     images: [
//         "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop",
//         "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop",
//         "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop"
//     ],
//     pricePerDay: 3500,
//     rating: 4.9,
//     location: "Banani, Dhaka",
//     availableDate: "Available Now",
//     category: "Cameras",
//     specifications: [
//         { label: "Sensor Size", value: "Full-Frame (35.9 x 23.9 mm)" },
//         { label: "Resolution", value: "33 Megapixels" },
//         { label: "Video Quality", value: "4K at 60p (10-bit 4:2:2)" },
//         { label: "ISO Range", value: "100 - 51,200" },
//         { label: "Lens Mount", value: "Sony E-Mount" }
//     ],
//     reviews: [
//         { id: "r1", reviewerName: "Asif Rahman", rating: 5, comment: "The autofocus is mind-blowing. Used it for a 3-day corporate shoot, highly recommended!", date: "2026-07-01" },
//         { id: "r2", reviewerName: "Nusrat Jahan", rating: 4.8, comment: "Excellent low light performance. The body was clean and well-maintained by the lender.", date: "2026-07-05" }
//     ]
// };

// // ২. রিলেটেড আইটেম ডাটা (রিকোয়ারমেন্টের শেষ অংশ)
// const relatedGadgets = [
//     { id: "2", title: "DJI Mavic 3 Pro Drone", price: 5000, img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=400&auto=format&fit=crop", rating: 4.8 },
//     { id: "3", title: "Sigma 24-70mm f/2.8 Lens", price: 1500, img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=400&auto=format&fit=crop", rating: 4.9 }
// ];

// export default function GadgetDetailsPage() {
//     // একাধিক ইমেজের মধ্যে কোন ইমেজটি বড় করে দেখাবে তার স্টেট
//     const [activeImage, setActiveImage] = useState<string>(singleGadgetData.images[0]);

//     return (
//         <div className="bg-gray-50 min-h-screen py-10">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//                 {/* ব্রেডক্রাম্ব বা ব্যাক লিংক */}
//                 <div className="mb-6">
//                     <Link href="/" className="text-indigo-600 hover:underline text-sm font-medium">
//                         ← Back to Featured Gear
//                     </Link>
//                 </div>

//                 {/* মেইন গ্রিড: ইমেজ এবং প্রাইস কার্ড */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">

//                     {/* বাম পাশ: ইমেজ গ্যালারি (Multiple Images) */}
//                     <div className="space-y-4">
//                         <div className="h-96 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
//                             <img src={activeImage} alt={singleGadgetData.title} className="w-full h-full object-cover transition-all duration-300" />
//                         </div>
//                         {/* ছোট থাম্বনেইল ইমেজ লিস্ট */}
//                         <div className="flex space-x-3">
//                             {singleGadgetData.images.map((img, idx) => (
//                                 <button
//                                     key={idx}
//                                     onClick={() => setActiveImage(img)}
//                                     className={`w-24 h-20 rounded-lg overflow-hidden border-2 bg-gray-50 transition-all ${activeImage === img ? 'border-indigo-600 scale-95' : 'border-gray-200 hover:border-indigo-300'
//                                         }`}
//                                 >
//                                     <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* ডান পাশ: প্রাইস, কুইক ইনফো ও বুকিং অ্যাকশন */}
//                     <div className="flex flex-col justify-between">
//                         <div>
//                             <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{singleGadgetData.category}</span>
//                             <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950 mt-3 mb-2">{singleGadgetData.title}</h1>

//                             <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 font-medium">
//                                 <span>⭐ <strong className="text-gray-800">{singleGadgetData.rating}</strong> (Reviews)</span>
//                                 <span>📍 {singleGadgetData.location}</span>
//                                 <span className="text-emerald-600">● {singleGadgetData.availableDate}</span>
//                             </div>

//                             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
//                                 <span className="text-gray-400 text-xs block uppercase tracking-wide font-semibold">Rental Price</span>
//                                 <div className="flex items-baseline space-x-1 mt-1">
//                                     <span className="text-3xl font-black text-indigo-600">৳{singleGadgetData.pricePerDay}</span>
//                                     <span className="text-gray-500 text-sm font-medium">/ per day</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-md transition-all cursor-pointer text-center">
//                             Instant Rent Now
//                         </button>
//                     </div>
//                 </div>

//                 {/* সেকশন ১: Description / Overview */}
//                 <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
//                     <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Description / Overview</h2>
//                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">{singleGadgetData.fullDescription}</p>
//                 </div>

//                 {/* সেকশন ২: Specifications */}
//                 <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
//                     <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Key Information & Specifications</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {singleGadgetData.specifications.map((spec, idx) => (
//                             <div key={idx} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-lg border border-gray-100 text-sm">
//                                 <span className="text-gray-500 font-medium">{spec.label}</span>
//                                 <span className="text-gray-800 font-bold">{spec.value}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* সেকশন ৩: Reviews / Ratings */}
//                 <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
//                     <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Customer Reviews & Ratings</h2>
//                     <div className="space-y-6">
//                         {singleGadgetData.reviews.map((rev) => (
//                             <div key={rev.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
//                                 <div className="flex justify-between items-center mb-2">
//                                     <h4 className="font-bold text-gray-800 text-sm md:text-base">{rev.reviewerName}</h4>
//                                     <span className="text-xs text-gray-400 font-medium">{rev.date}</span>
//                                 </div>
//                                 <div className="text-amber-500 text-xs mb-2">{"★".repeat(Math.floor(rev.rating))} <span className="text-gray-700 font-bold ml-1">{rev.rating}</span></div>
//                                 <p className="text-gray-600 text-sm leading-relaxed">"{rev.comment}"</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* সেকশন ৪: Related Items (সব কার্ডের সেম সাইজ ও বর্ডার রেডিয়াস রুলসহ) */}
//                 <div>
//                     <h2 className="text-xl font-bold text-gray-900 mb-6">Related Premium Gear</h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
//                         {relatedGadgets.map((item) => (
//                             <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
//                                 <div className="h-40 w-full bg-gray-100">
//                                     <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
//                                 </div>
//                                 <div className="p-4 flex flex-col flex-grow justify-between">
//                                     <div>
//                                         <h3 className="text-gray-800 font-bold text-base mb-1 line-clamp-1">{item.title}</h3>
//                                         <span className="text-amber-500 text-xs">⭐ {item.rating}</span>
//                                     </div>
//                                     <div className="pt-3 border-t border-gray-50 flex items-center justify-between mt-4">
//                                         <span className="text-indigo-600 font-extrabold text-base">৳{item.price}/day</span>
//                                         <button className="text-indigo-600 bg-indigo-50 font-semibold text-xs px-3 py-2 rounded-lg cursor-pointer">View</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }