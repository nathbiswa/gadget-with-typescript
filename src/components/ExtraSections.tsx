'use client';

export default function ExtraSections() {
  // ৪. ক্যাটাগরি ডাটা
  const categories = [
    { name: "Cameras & Lenses", icon: "📷", count: "45+ Items" },
    { name: "Gaming Laptops", icon: "💻", count: "28+ Items" },
    { name: "Drones & Aerial", icon: "🛸", count: "15+ Items" },
    { name: "Audio & Microphones", icon: "🎙️", count: "32+ Items" },
  ];

  // ৫. হাউ ইট ওয়ার্কস ডাটা
  const steps = [
    { title: "Select Gear", desc: "Choose from our wide range of premium certified tech equipment." },
    { title: "Pick Dates", desc: "Select your rental duration with flexible daily or weekly plans." },
    { title: "Get it Delivered", desc: "Receive the item at your doorstep or pick it up from our hub." },
    { title: "Return Safely", desc: "Pack it up and return it after your project is successfully done." },
  ];

  // ৬. টেস্টিমোনিয়াল ডাটা
  const reviews = [
    { name: "Tanvir Ahmed", role: "Wedding Filmmaker", comment: "Renting the Sony A7IV saved my project budget. The camera was in pristine condition!", stars: 5 },
    { name: "Sadiya Rahman", role: "UI/UX Student", comment: "Borrowed an iPad Pro for my design submission. Extremely smooth process and fast delivery.", stars: 5 },
  ];

  return (
    <div className="bg-slate-50/50">
      
      {/* ━━━ সেকশন ৪: টপ ক্যাটাগরি ━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-gray-950 text-center mb-10">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 text-center hover:shadow-sm cursor-pointer transition-shadow">
              <span className="text-4xl block mb-3">{cat.icon}</span>
              <h3 className="font-bold text-gray-800">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ সেকশন ৫: কীভাবে কাজ করে (How it works) ━━━ */}
      <section className="bg-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-12">How GadgetLease Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 border-4 border-indigo-900">
                  {i + 1}
                </div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ সেকশন ৬: টেস্টিমোনিয়াল ━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-gray-950 text-center mb-10">What Our Renters Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-gray-600 italic mb-6">"{rev.comment}"</p>
              <div>
                <div className="text-amber-500 mb-1">{"★".repeat(rev.stars)}</div>
                <h4 className="font-bold text-gray-800">{rev.name}</h4>
                <p className="text-xs text-gray-400">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ সেকশন ৭: নিউজলেটার ━━━ */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white shadow-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Never Miss a Deal Again!</h2>
          <p className="text-indigo-100 text-sm max-w-md mx-auto mb-6">Subscribe to our newsletter and get updates on exclusive gadget drops and discount coupons.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" className="bg-white/10 placeholder-indigo-200 border border-indigo-400/30 px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white w-full" required />
            <button type="submit" className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-lg text-sm hover:bg-indigo-50 transition-colors whitespace-nowrap cursor-pointer">Join Now</button>
          </form>
        </div>
      </section>

    </div>
  );
}