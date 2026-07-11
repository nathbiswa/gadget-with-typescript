'use client';

import { useState, useEffect } from 'react';
import { Gadget } from '@/types/gadget';
import GadgetCard from './GadgetCard';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden h-[400px] animate-pulse p-5 flex flex-col justify-between">
      <div className="bg-gray-200 h-44 rounded-lg w-full mb-4"></div>
      <div className="space-y-3 flex-grow">
        <div className="bg-gray-200 h-4 rounded w-1/3"></div>
        <div className="bg-gray-200 h-5 rounded w-3/4"></div>
        <div className="bg-gray-200 h-4 rounded w-full"></div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
        <div className="bg-gray-200 h-6 rounded w-1/4"></div>
        <div className="bg-gray-200 h-9 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export default function GadgetGrid() {
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const dummyGadgets: Gadget[] = [
    {
      id: "1",
      title: "Sony Alpha 7 IV Mirrorless Camera",
      shortDescription: "33MP full-frame sensor, perfect for high-end wedding videography and professional photography.",
      fullDescription: "",
      images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop"], // images ব্যবহার করা হলো
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
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setGadgets(dummyGadgets);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Featured Rental Gear</h2>
        <p className="text-gray-500 mt-2 text-sm">Explore our top-rated tech gear available for rent today near you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
          : gadgets.map((gadget) => <GadgetCard key={gadget.id} gadget={gadget} />)
        }
      </div>
    </div>
  );
}