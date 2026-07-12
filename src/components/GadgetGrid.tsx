
import { Gadget } from '@/types/gadget';
import GadgetCard from './GadgetCard';

// ১. এটি একটি সার্ভার কম্পোনেন্ট (Server Component) হিসেবে কাজ করবে
export default async function FeaturedGadgets() {

  // ব্যাকএন্ডের ফিচারড এপিআই কল করা হচ্ছে
  const res = await fetch(`${process.env.BASE_URL}/api/gadgets/featured`, {
    cache: 'no-store', // সবসময় একদম লেটেস্ট ডাটা দেখাবে
    next: { revalidate: 60 }
  });

  const result = await res.json();
  const featuredProducts: Gadget[] = result.data || [];
  console.log('Featured Products:', featuredProducts); // ডাটা কনসোল লগে দেখানো হচ্ছে

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-6">Featured Rental Gear</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredProducts.map((gadget) => (
          <GadgetCard key={gadget._id} gadget={gadget} />
        ))}
      </div>
    </section>
  );
}