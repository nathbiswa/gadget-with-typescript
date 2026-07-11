// src/app/page.tsx

import Hero from "@/components/Hero";
import GadgetGrid from "@/components/GadgetGrid";
import ExtraSections from "@/components/ExtraSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      <Hero />
      
      <div id="explore-section">
        <GadgetGrid />
      </div>
      <ExtraSections />
    </main>
  );
}