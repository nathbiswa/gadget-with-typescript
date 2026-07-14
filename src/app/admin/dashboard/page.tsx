'use client';

import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // 📸 পেন্ডিং গ্যাজেটের জন্য নতুন স্টেটসমূহ
  const [pendingGadgets, setPendingGadgets] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // 🔄 ৩টি ট্যাব কন্ট্রোল করার অপশন
  const [activeTab, setActiveTab] = useState<'bookings' | 'add-gadget' | 'pending-approvals'>('bookings');

  // ফর্ম স্টেটসমূহ (নতুন গ্যাজেটের জন্য)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Camera',
    pricePerDay: '',
    shortDescription: '',
    fullDescription: '',
    imageInput: '',
    location: 'Dhaka',
  });

  // 🛡️ সেশন সিকিউরিটি ও গ্লোবাল বুকিং লোড
  // 🎯 আপনার ফাইলের ৩3 নম্বর লাইন থেকে শুরু হওয়া প্রথম useEffect-টি এটি দিয়ে রিপ্লেস করুন:
  useEffect(() => {
    if (!isPending && (!session?.user || session.user.role !== 'admin')) {
      toast.error("Access Denied! Admins only.", { autoClose: 5000 });
      router.push('/login');
      return;
    }

    if (session?.user) {
      setLoadingBookings(true);

      // ইমেইল এবং ইউজার আইডি দুটোই প্যারামিটারে পাঠানো হচ্ছে সেফটির জন্য
      const email = session.user.email;
      const userId = session.user.id;

      fetch(`http://localhost:5000/api/admin/bookings?email=${email}&userId=${userId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setAllBookings(json.data);
          } else {
            console.error("Backend response error:", json.message);
          }
          setLoadingBookings(false);
        })
        .catch(err => {
          console.error("Admin Fetch Error:", err);
          setLoadingBookings(false);
        });
    }
  }, [session, isPending, router]);
  // useEffect(() => {
  //   if (!isPending && (!session?.user || session.user.role !== 'admin')) {
  //     toast.error("Access Denied! Admins only.", { autoClose: 5000 });
  //     router.push('/login');
  //     return;
  //   }

  //   if (session?.user?.id) {
  //     setLoadingBookings(true);
  //     fetch(`http://localhost:5000/api/admin/bookings?email=${session.user.email}`)
  //       .then(res => res.json())
  //       .then(json => {
  //         if (json.success) setAllBookings(json.data);
  //         setLoadingBookings(false);
  //       })
  //       .catch(err => {
  //         console.error("Admin Fetch Error:", err);
  //         setLoadingBookings(false);
  //       });
  //   }
  // }, [session, isPending, router]);

  // 📥 ইউজারদের পাঠানো পেন্ডিং গ্যাজেট ফেচ করার নতুন লজিক
  const fetchPendingGadgets = async () => {
    setLoadingPending(true);
    try {
      // আমরা মাত্র ব্যাকএন্ডে যে নতুন এপিআই বানালাম, সেখান থেকে ডাটা আনছি
      const res = await fetch(`http://localhost:5000/api/admin/pending-gadgets`, {
        cache: 'no-store'
      });
      const json = await res.json();

      if (json.success) {
        setPendingGadgets(json.data); // সরাসরি পেন্ডিং ডাটা সেভ হবে
      }
    } catch (error) {
      console.error('Failed to load pending gadgets', error);
    } finally {
      setLoadingPending(false);
    }
  };
  // যখনই অ্যাডমিন পেন্ডিং ট্যাবে ক্লিক করবে, লাইভ ডাটা লোড হবে
  useEffect(() => {
    if (activeTab === 'pending-approvals') {
      fetchPendingGadgets();
    }
  }, [activeTab]);

  // ⚡ স্ট্যাটাস আপডেট হ্যান্ডলার (Approve/Reject)
  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    let token = '';
    try {
      const res = await authClient.token();

      if (res.error) {
        console.error("AuthClient Error:", res.error);
      }

      if (res.data) {
        token = res.data.token; // 🎯 আসল টোকেন এখানে থাকে
      }
    } catch (error) {
      console.error("Token catch block error:", error);
    }
    console.log("Token:", token);

    setActionLoadingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/gadgets/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (json.success) {
        // সফল হলে রিয়েল-টাইমে লিস্ট থেকে আইটেমটি বাদ যাবে
        setPendingGadgets((prev) => prev.filter((item) => item._id !== id));
        toast.success(`🎉 Listing successfully ${newStatus}!`);
      } else {
        toast.error(json.message || 'Action failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // নতুন গ্যাজেট সাবমিট হ্যান্ডলার (অ্যাডমিনের নিজের প্রোডাক্ট সরাসরি approved থাকবে)
  const handleAddGadget = async (e: React.FormEvent) => {
    e.preventDefault();
    let token = '';
    try {
      const res = await authClient.token();

      if (res.error) {
        console.error("AuthClient Error:", res.error);
      }

      if (res.data) {
        token = res.data.token; // 🎯 আসল টোকেন এখানে থাকে
      }
    } catch (error) {
      console.error("Token catch block error:", error);
    }
    console.log("Token:", token);
    try {
      const gadgetPayload = {
        ...formData,
        pricePerDay: Number(formData.pricePerDay),
        images: formData.imageInput ? formData.imageInput.split(',').map(img => img.trim()) : ['https://placehold.co/600x400'],
        userId: session?.user?.id,
        status: 'approved' // 🔒 অ্যাডমিন নিজে পোস্ট করলে সরাসরি লাইভ হবে
      };

      const res = await fetch('http://localhost:5000/api/items/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(gadgetPayload)
      });

      const json = await res.json();
      if (json.success) {
        toast.success("🔥 Premium Gear Published Live Successfully!");
        setFormData({ title: '', category: 'Camera', pricePerDay: '', shortDescription: '', fullDescription: '', imageInput: '', location: 'Dhaka' });
        setActiveTab('bookings');
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
      <ToastContainer position="top-center" />

      {/* হেডার */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-950">Admin Workspace</h1>
          <p className="text-gray-500 text-sm mt-1">Logged in as: <span className="font-semibold text-indigo-600">{session.user.email}</span></p>
        </div>

        {/* 📑 ৩টি কাস্টম ট্যাব বাটন */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 bg-gray-100 p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveTab('pending-approvals')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'pending-approvals' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Pending Approvals
            {pendingGadgets.length > 0 && (
              <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse">{pendingGadgets.length}</span>
            )}
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

      {/* ⏳ নতুন ট্যাব: পেন্ডিং প্রোডাক্ট অ্যাপ্রুভাল প্যানেল */}
      {activeTab === 'pending-approvals' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">User Submissions for Approval</h2>
          {loadingPending ? (
            <div className="text-center py-10 text-gray-400 text-sm">Loading pending pipeline...</div>
          ) : pendingGadgets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-4">Gear Details</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Price / Day</th>
                    <th className="pb-4">Location</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {pendingGadgets.map((gadget) => (
                    <tr key={gadget._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                          <img src={gadget.images?.[0] || 'https://placehold.co/100'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 line-clamp-1 max-w-[180px]">{gadget.title}</div>
                          <div className="text-[10px] text-gray-400 truncate max-w-[180px]">Owner ID: {gadget.addedBy}</div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600 font-medium">{gadget.category}</td>
                      <td className="py-4 font-bold text-gray-800">৳{gadget.pricePerDay}</td>
                      <td className="py-4 text-gray-500">{gadget.location}</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={actionLoadingId === gadget._id}
                            onClick={() => handleStatusUpdate(gadget._id, 'approved')}
                            className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            disabled={actionLoadingId === gadget._id}
                            onClick={() => handleStatusUpdate(gadget._id, 'rejected')}
                            className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm font-medium">
              🎉 No pending products! All user submissions are reviewed.
            </div>
          )}
        </div>
      )}

      {/* 📝 ট্যাব ৩: কাস্টম প্রোডাক্ট অ্যাড ফর্ম */}
      {activeTab === 'add-gadget' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-3xl mx-auto shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">List a New Premium Gadget</h2>
          <form onSubmit={handleAddGadget} className="space-y-5">
            {/* আপনার আগের ফরমের ইনপুট ফিল্ডসমূহ (হুবহু অপরিবর্তিত রাখা হয়েছে) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase">Product Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Sony FX3 Cinema Camera" className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase">Category</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50">
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
                <input type="number" required value={formData.pricePerDay} onChange={e => setFormData({ ...formData, pricePerDay: e.target.value })} placeholder="e.g. 1500" className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase">Location</label>
                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Dhanmondi, Dhaka" className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase">Image URLs (Comma separated for multiple)</label>
              <input type="text" value={formData.imageInput} onChange={e => setFormData({ ...formData, imageInput: e.target.value })} placeholder="https://images.com/pic1.jpg, https://images.com/pic2.jpg" className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase">Short Catchy Description</label>
              <input type="text" required value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Perfect low-light camera for cinematic videos." className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase">Full Detailed Description</label>
              <textarea rows={4} value={formData.fullDescription} onChange={e => setFormData({ ...formData, fullDescription: e.target.value })} placeholder="Write full package content, specifications, terms and conditions..." className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-indigo-500 bg-gray-50/50 resize-none" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-100 text-sm">
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