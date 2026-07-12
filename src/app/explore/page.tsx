
import GadgetCard from '@/components/GadgetCard';
import { Gadget } from '@/types/gadget';

export default async function ExplorePage() {

    // সব গ্যাজেট আনার এপিআই কল
    const res = await fetch(`${process.env.BASE_URL}/api/gadgets`, {
        cache: 'no-store' // সবসময় একদম লেটেস্ট ডাটা দেখাবে
    });

    const result = await res.json();
    const allGadgets: Gadget[] = result.data || [];
    console.log('All Gadgets:', allGadgets); // ডাটা কনসোল লগে দেখানো হচ্ছে

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Explore All Gadgets</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {allGadgets.map((gadget) => (
                    <GadgetCard key={gadget._id} gadget={gadget} />
                ))}
            </div>
        </div>
    );
}