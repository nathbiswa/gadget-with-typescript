// src/components/GadgetCard.tsx

import { Gadget } from '@/types/gadget';

interface GadgetCardProps {
  gadget: Gadget;
}

export default function GadgetCard({ gadget }: GadgetCardProps) {
  return (
    // রিকোয়ারমেন্ট অনুযায়ী সব কার্ডের সমান সাইজ ও স্টাইল নিশ্চিত করার জন্য flex flex-col এবং h-full ব্যবহার করা হয়েছে
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      
      {/* গ্যাজেট ইমেজ */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <img
          src={gadget.imageUrl}
          alt={gadget.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        {/* রেটিং ব্যাজ */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-amber-600 flex items-center shadow-sm">
          ⭐ {gadget.rating.toFixed(1)}
        </div>
      </div>

      {/* কার্ড কন্টেন্ট */}
      <div className="p-5 flex flex-col flex-grow">
        {/* লোকেশন ও ডেট */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2 font-medium">
          <span>📍 {gadget.location}</span>
          <span>📅 {gadget.availableDate}</span>
        </div>

        {/* টাইটেল */}
        <h3 className="text-gray-800 font-bold text-lg mb-1.5 line-clamp-1">
          {gadget.title}
        </h3>

        {/* শর্ট ডেসক্রিপশন */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {gadget.shortDescription}
        </p>

        {/* প্রাইস এবং বাটন সেকশন */}
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
          <div>
            <span className="text-indigo-600 font-extrabold text-lg">৳{gadget.pricePerDay}</span>
            <span className="text-gray-400 text-xs">/ day</span>
          </div>
          
          <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}