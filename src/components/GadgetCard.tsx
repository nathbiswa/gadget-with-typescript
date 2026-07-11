// src/components/GadgetCard.tsx

import { Gadget } from '@/types/gadget';
import Link from 'next/link';

interface GadgetCardProps {
  gadget: Gadget;
}

export default function GadgetCard({ gadget }: GadgetCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">

      {/* গ্যাজেট ইমেজ - এখানে আমরা images[0] ব্যবহার করছি নিরাপত্তা নিশ্চিত করতে */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {gadget.images && gadget.images.length > 0 ? (
          <img
            src={gadget.images[0]}
            alt={gadget.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-amber-600 flex items-center shadow-sm">
          ⭐ {gadget.rating.toFixed(1)}
        </div>
      </div>

      {/* কার্ড কন্টেন্ট */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2 font-medium">
          <span>📍 {gadget.location}</span>
          <span>📅 {gadget.availableDate}</span>
        </div>

        <h3 className="text-gray-800 font-bold text-lg mb-1.5 line-clamp-1">
          {gadget.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {gadget.shortDescription}
        </p>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
          <div>
            <span className="text-indigo-600 font-extrabold text-lg">৳{gadget.pricePerDay}</span>
            <span className="text-gray-400 text-xs">/ day</span>
          </div>

          <Link href={`/explore/${gadget.id}`} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-center">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}