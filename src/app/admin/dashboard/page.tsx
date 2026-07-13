'use client';

import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'add-gadget'>('bookings');

  // ফর্ম স্টেটসমূহ (নতুন গ্যাজেটের জন্য)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Camera',
    pricePerDay: '',
    shortDescription: '',
    fullDescription: '',
    imageInput: '', // কমা দিয়ে সেপারেটেড ইমেজের লিংক দেওয়ার জন্য
    location: 'Dhaka',
  });

  // সেশন ও সিকিউরিটি চেক এবং বুকিং ডেটা লোড
  // useEffect(() => {
  //   if (!isPending && (!session?.user || session.user.role !== 'admin')) {
  //     toast.error("Access Denied! Admins only.");
  //     router.push('/login');
  //     return;
  //   }

  //   if (session?.user?.role === 'admin') {
  //     fetch(`http://localhost:5000/api/admin/bookings?userId=${session.user.id}`)
  //       .then(res => res.json())
  //       .then(json => {
  //         if (json.success) setAllBookings(json.data);
  //         setLoadingBookings(false);
  //       })
  //       .catch(err => {
  //         console.error(err);
  //         setLoadingBookings(false);
  //       });
  //   }
  // }, [session, isPending, router]);
  useEffect(() => {
    if (!isPending && (!session?.user || session.user.role !== 'admin')) {
      toast.error("Access Denied! Admins only.");
      router.push('/login');
      return;
    }

    // 🎯 Better Auth সেশন থেকে প্রাপ্ত রিয়েল ইউজার আইডি ব্যাকএন্ডে পাঠানো হচ্ছে
    if (session?.user?.id) {
      setLoadingBookings(true);

      fetch(`http://localhost:5000/api/admin/bookings?userId=${session.user.id}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setAllBookings(json.data);
          } else {
            toast.error(json.message || "Failed to load bookings");
          }
          setLoadingBookings(false);
        })
        .catch(err => {
          console.error("Admin Fetch Error:", err);
          toast.error("Server error while fetching bookings.");
          setLoadingBookings(false);
        });
    }
  }, [session, isPending, router]);

  // নতুন গ্যাজেট সাবমিট হ্যান্ডলার
  const handleAddGadget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gadgetPayload = {
        ...formData,
        images: formData.imageInput ? formData.imageInput.split(',').map(img => img.trim()) : [],
      };

      const res = await fetch('http://localhost:5000/api/admin/gadgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gadgetPayload)
      });

      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        // ফর্ম রিসেট করা
        setFormData({ title: '', category: 'Camera', pricePerDay: '', shortDescription: '', fullDescription: '', imageInput: '', location: 'Dhaka' });
        setActiveTab('bookings'); // আবার বুকিং ট্যাবে নিয়ে যাবে
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add gadget.");
    }
  };

  if (isPending) return <div className="text-center py-20">Verifying admin session...</div>;
  if (!session?.user || session.user.role !== 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-950">Admin Workspace</h1>
          <p className="text-gray-500 text-sm mt-1">Logged in as: <span className="font-semibold text-indigo-600">{session.user.email}</span></p>
        </div>

        {/* ট্যাব বাটন সমূহ */}
        <div className="flex gap-3 mt-4 md:mt-0 bg-gray-100 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveTab('add-gadget')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'add-gadget' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            + Add New Gear
          </button>
        </div>
      </div>

      {/* 📊 ট্যাব ১: অল বুকিংস ম্যানেজমেন্ট */}
      {activeTab === 'bookings' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Global Rental Tracking</h2>
          {loadingBookings ? (
            <div className="text-center py-10 text-gray-400 text-sm">Fetching logistics matrix...</div>
          ) : allBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-4">Customer Email</th>
                    <th className="pb-4">Product / Gear</th>
                    <th className="pb-4">Duration</th>
                    <th className="pb-4">Revenue</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {allBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50/50">
                      <td className="py-4 font-medium text-gray-900">{booking.userEmail}</td>
                      <td className="py-4 text-gray-600">{booking.gadgetId?.title || 'Deleted Item'}</td>
                      <td className="py-4 text-xs text-gray-500">{booking.startDate} to {booking.endDate}</td>
                      <td className="py-4 font-bold text-indigo-600">৳{booking.totalCost}</td>
                      <td className="py-4">
                        <span className="bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                          ● {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">No rental records found in the database.</div>
          )}
        </div>
      )}

      {/* 📝 ট্যাব ২: অ্যাড নিউ গ্যাজেট ফর্ম */}
      {activeTab === 'add-gadget' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-3xl mx-auto shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">List a New Premium Gadget</h2>

          <form onSubmit={handleAddGadget} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sony FX3 Cinema Camera"
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50"
                >
                  <option value="Camera">Camera</option>
                  <option value="Drone">Drone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Lens">Lens</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase">Price Per Day (৳)</label>
                <input
                  type="number"
                  required
                  value={formData.pricePerDay}
                  onChange={e => setFormData({ ...formData, pricePerDay: e.target.value })}
                  placeholder="e.g. 1500"
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase">Image URLs (Comma separated for multiple)</label>
              <input
                type="text"
                value={formData.imageInput}
                onChange={e => setFormData({ ...formData, imageInput: e.target.value })}
                placeholder="https://images.com/pic1.jpg, https://images.com/pic2.jpg"
                className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase">Short Catchy Description</label>
              <input
                type="text"
                required
                value={formData.shortDescription}
                onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Perfect low-light camera for cinematic videos."
                className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase">Full Detailed Description</label>
              <textarea
                rows={4}
                value={formData.fullDescription}
                onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Write full package content, specifications, terms and conditions..."
                className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-100 text-sm"
            >
              Publish Item Live
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// 'use client';

// import { authClient } from '@/lib/auth-client';
// import { useEffect, useState } from 'react';

// export default function AdminDashboard() {
//   const [allBookings, setAllBookings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   // const [errorMsg, setErrorMsg] = useState('');

//   const { data: session } = authClient.useSession();
//   const currentUserEmail = session?.user?.email;
//   console.log('Current User Email:', currentUserEmail); // ডাটা কনসোল লগে দেখানো হচ্ছে

//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/admin/bookings?email=${currentUserEmail}`, {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const result = await res.json();

//         if (result.success) {
//           setAllBookings(result.data);
//         } else {
//           setErrorMsg(result.message);
//         }
//       } catch (error) {
//         console.error("Failed to load admin dashboard", error);
//         setErrorMsg("Error loading admin dashboard. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdminData();
//   }, []);

//   // if (errorMsg) {
//   //   return (
//   //     <div className="container mx-auto px-4 py-20 text-center">
//   //       <div className="text-red-500 font-bold text-xl mb-2">🛑 {errorMsg}</div>
//   //       <p className="text-gray-400 text-sm">এই পেজটি শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য সংরক্ষিত।</p>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="container mx-auto px-4 py-10 max-w-6xl">
//       <div className="mb-8">
//         <h1 className="text-3xl font-black text-gray-800">Admin Control Panel</h1>
//         <p className="text-gray-500 text-sm">Overview of all user rentals and global logistics.</p>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//         <h2 className="text-xl font-bold text-gray-800 mb-6 font-mono">🎯 Total Orders: {allBookings.length}</h2>

//         {loading ? (
//           <div className="text-center py-6 text-gray-400">Loading master data...</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
//                   <th className="pb-4">Customer</th>
//                   <th className="pb-4">Rented Gear</th>
//                   <th className="pb-4">Cost</th>
//                   <th className="pb-4">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50 text-sm">
//                 {allBookings.map((booking) => (
//                   <tr key={booking._id}>
//                     <td className="py-4">
//                       <div className="font-semibold text-gray-800">{booking.userEmail}</div>
//                       <div className="text-xs text-gray-400">ID: {booking.userId}</div>
//                     </td>
//                     <td className="py-4 text-gray-700 font-medium">
//                       {booking.gadgetId?.title || "Deleted Item"}
//                     </td>
//                     <td className="py-4 font-bold text-indigo-600">৳{booking.totalCost}</td>
//                     <td className="py-4">
//                       <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
//                         ● {booking.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }