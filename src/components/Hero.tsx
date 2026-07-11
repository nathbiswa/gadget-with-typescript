'use client';

import { useState, useEffect } from 'react';

// ১. টাইপস্ক্রিপ্ট দিয়ে প্রতিটি স্লাইডের ডাটা স্ট্রাকচার ঠিক করা
interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  bgImage: string;
  ctaText: string;
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // ২. রিয়েলস্টিক ডাটা (কোনো ডামি টেক্সট বা লরেম ইপসাম নয়)
  const slides: SlideData[] = [
    {
      id: 1,
      title: "Cinematic Cameras & Gear",
      subtitle: "Rent the Sony Alpha 7 IV or RED Komodo for your next big shoot. Premium lenses included.",
      bgImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
      ctaText: "Rent Camera Kits"
    },
    {
      id: 2,
      title: "Next-Gen Gaming Laptops",
      subtitle: "Power up your weekend with ASUS ROG or MSI laptops packed with RTX 4090 graphics.",
      bgImage: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=1600&auto=format&fit=crop",
      ctaText: "Explore Gaming Rigs"
    },
    {
      id: 3,
      title: "Professional Production Drones",
      subtitle: "Capture stunning aerial views with DJI Mavic 3 Pro. Fully certified and ready to fly.",
      bgImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1600&auto=format&fit=crop",
      ctaText: "Book a Drone"
    }
  ];

  // ৩. অটো-স্লাইডার লজিক (প্রতি ৫ সেকেন্ড পর পর স্লাইড পরিবর্তন হবে)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // ৫০০০ মিলি-সেকেন্ড = ৫ সেকেন্ড

    return () => clearInterval(timer); // কম্পোনেন্ট আনমাউন্ট হলে টাইমার পরিষ্কার করবে
  }, [slides.length]);

  // নিচে স্ক্রল করার ফাংশন
  const handleScrollToExplore = (): void => {
    const nextSection = document.getElementById('explore-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // রিকোয়ারমেন্ট অনুযায়ী হাইট স্ক্রিনের ৬৫% রাখা হয়েছে
    <div className="relative w-full h-[65vh] bg-slate-950 text-white overflow-hidden">
      
      {/* স্লাইডার ইমেজ এবং টেক্সট কন্টেইনার */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* ব্যাকগ্রাউন্ড ইমেজ ও ডার্ক ওভারলে (টেক্সট ক্লিয়ার দেখার জন্য) */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[5000s] ease-linear"
            style={{ backgroundImage: `url('${slide.bgImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-transparent" />

          {/* স্লাইড কন্টেন্ট (অ্যানিমেশনসহ) */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-4xl mx-auto px-6 md:px-12 w-full">
              <div className={`transition-all duration-700 transform ${
                index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {/* হাইলাইট ট্যাগ */}
                <span className="inline-block bg-indigo-600/80 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
                  Trending Rentals
                </span>
                
                {/* মেইন টাইটেল */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white leading-tight">
                  {slide.title}
                </h1>
                
                {/* সাবটাইটেল */}
                <p className="text-base md:text-xl text-gray-300 max-w-xl mb-8 font-light leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* CTA বাটন */}
                <button
                  onClick={handleScrollToExplore}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  {slide.ctaText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* স্লাইডার ডট ইন্ডিকেটরস (নিচে ছোট ছোট ডট) */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-indigo-500' : 'w-2.5 bg-gray-400/50'
            }`}
          />
        ))}
      </div>

      {/* নিচের দিকে নামার জন্য ভিজ্যুয়াল অ্যারো ইন্ডিকেটর */}
      <div 
        className="absolute bottom-4 right-6 md:right-12 z-20 animate-bounce cursor-pointer bg-slate-900/60 p-2 rounded-full border border-gray-700/50 backdrop-blur-sm hidden sm:block" 
        onClick={handleScrollToExplore}
      >
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
}