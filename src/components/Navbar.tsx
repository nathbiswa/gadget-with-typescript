'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@heroui/react";
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';

interface NavItem {
  label: string;
  path: string;
}

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const redirect = (url: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  // 🎯 ডাইনামিক রুট কন্ডিশন (অ্যাডমিনের জন্য একদম ক্লিন মেনু)
  let routes: NavItem[] = [];

  if (user) {
    if (isAdmin) {
      // 👑 ইউজার অ্যাডমিন হলে শুধুমাত্র এই মেনুগুলো থাকবে
      routes = [
        { label: 'Admin Dashboard', path: '/admin/dashboard' },
      ];
    } else {
      // 👥 ইউজার সাধারণ কাস্টমার হলে সব মেনু থাকবে
      routes = [
        { label: 'Home', path: '/' },
        { label: 'Explore Gadgets', path: '/explore' },
        { label: 'Add Item', path: '/items/add' },
        { label: 'Manage Items', path: '/items/manage' },
        { label: 'Dashboard', path: '/dashboard' },
      ];
    }
  } else {
    // 🌐 ইউজার লগইন না থাকলে (Guest)
    routes = [
      { label: 'Home', path: '/' },
      { label: 'Explore', path: '/explore' },
      { label: 'Login', path: '/login' },
      { label: 'Register', path: '/register' },
    ];
  }

  const handleLogout = async () => {
    await authClient.signOut();
    redirect('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={isAdmin ? "/admin/dashboard" : "/"} className="text-2xl font-bold text-indigo-600">
              Gadget<span className="text-gray-800">Lease</span>
              {isAdmin && <span className="ml-2 text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-lg uppercase tracking-wider font-mono">Admin</span>}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-2">
              {routes.map((route, index) => {
                const isActive = pathname === route.path;
                return (
                  <Link
                    key={index}
                    href={route.path}
                    className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
                      }`}
                  >
                    {route.label}
                  </Link>
                );
              })}
            </div>

            {/* User Profile & Logout Section (If Logged In) */}
            {user && (
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                {user.image && (
                  <Image
                    src={user.image}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover border border-gray-200"
                  />
                )}
                <Button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Trigger */}
          <div className="-mr-2 flex md:hidden items-center space-x-3">
            {user && user.image && (
              <Image
                src={user.image}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 focus:outline-none"
            >
              {isOpen ? <span className="text-xl font-bold px-1">✕</span> : <span className="text-xl font-bold px-1">☰</span>}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {routes.map((route, index) => {
              const isActive = pathname === route.path;
              return (
                <Link
                  key={index}
                  href={route.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-all ${isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                >
                  {route.label}
                </Link>
              );
            })}

            {user && (
              <div className="pt-3 border-t border-gray-100 px-4">
                <Button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Button } from "@heroui/react";
// import Image from 'next/image';
// import { authClient } from '@/lib/auth-client';

// interface NavItem {
//   label: string;
//   path: string;
// }

// export default function Navbar() {
//   const { data: session } = authClient.useSession();
//   const user = session?.user;
//   // console.log('User:', user);
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const pathname = usePathname(); // Tracks current active URL path
//   const redirect = (url: string) => {
//     if (typeof window !== 'undefined') {
//       window.location.href = url;
//     }
//   };

//   const routes: NavItem[] = user
//     ? [
//       { label: 'Home', path: '/' },
//       { label: 'Explore Gadgets', path: '/explore' },
//       { label: 'Add Item', path: '/items/add' },
//       { label: 'Manage Items', path: '/items/manage' },
//       { label: 'Dashboard', path: '/dashboard' },
//     ]
//     : [
//       { label: 'Home', path: '/' },
//       { label: 'Explore', path: '/explore' },
//       { label: 'Login', path: '/login' },
//       { label: 'Register', path: '/register' },
//     ];

//   const handleLogout = async () => {
//     await authClient.signOut();
//     redirect('/login');
//   };

//   return (
//     <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">

//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="text-2xl font-bold text-indigo-600">
//               Gadget<span className="text-gray-800">Lease</span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             <div className="flex items-baseline space-x-2">
//               {routes.map((route, index) => {
//                 const isActive = pathname === route.path;
//                 return (
//                   <Link
//                     key={index}
//                     href={route.path}
//                     className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${isActive
//                       ? 'bg-indigo-50 text-indigo-600 shadow-sm'
//                       : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
//                       }`}
//                   >
//                     {route.label}
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* User Profile & Logout Section (If Logged In) */}
//             {user && (
//               <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
//                 <Image
//                   src={user.image}
//                   alt="User Avatar"
//                   width={40}
//                   height={40}
//                   className="rounded-full object-cover border border-gray-200"
//                 />
//                 <Button
//                   onClick={handleLogout}
//                   className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
//                 >
//                   Logout
//                 </Button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Hamburger Menu Trigger */}
//           <div className="-mr-2 flex md:hidden items-center space-x-3">
//             {user && (
//               <Image
//                 src={user.image}
//                 alt="User Avatar"
//                 width={40}
//                 height={40}
//                 className="w-8 h-8 rounded-full object-cover border border-gray-200"
//               />
//             )}
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 focus:outline-none"
//             >
//               {isOpen ? <span className="text-xl font-bold px-1">✕</span> : <span className="text-xl font-bold px-1">☰</span>}
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="md:hidden bg-white border-b border-gray-200 animate-fadeIn">
//           <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
//             {routes.map((route, index) => {
//               const isActive = pathname === route.path;
//               return (
//                 <Link
//                   key={index}
//                   href={route.path}
//                   onClick={() => setIsOpen(false)}
//                   className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-all ${isActive
//                     ? 'bg-indigo-50 text-indigo-600'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
//                     }`}
//                 >
//                   {route.label}
//                 </Link>
//               );
//             })}

//             {user && (
//               <div className="pt-3 border-t border-gray-100 px-4">
//                 <Button
//                   onClick={() => { setIsOpen(false); handleLogout(); }}
//                   className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl text-sm transition-all cursor-pointer"
//                 >
//                   Logout
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }