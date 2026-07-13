'use client';

import Link from 'next/link';
import { Check } from "@gravity-ui/icons";
import { Button, Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    // 🔄 যদি ইউজার অলরেডি লগইন করা থাকে, তবে তাকে অটোমেটিক রিডাইরেক্ট করার জন্য useEffect
    useEffect(() => {
        if (!isPending && session?.user) {
            if (session.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        }
    }, [session, isPending, router]);

    // Form submit handler using FormData
    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const user = Object.fromEntries(formData.entries());

        try {
            const { data, error } = await authClient.signIn.email({
                email: user.email as string,
                password: user.password as string,
            });

            if (error) {
                toast.error(error.message || 'Login failed! Please check credentials.');
                return;
            }

            toast.success('Login successful!');

            // 🎯 সাকসেস হওয়ার পর Better Auth-এর সেশন ইনস্ট্যান্ট রি-ফেচ করে রোল অনুযায়ী রিডাইরেক্ট করা
            const updatedSession = await authClient.getSession();
            if (updatedSession?.data?.user?.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

    // Google Login Handler
    const handleGoogleLogin = async () => {
        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/' // গুগল অথেন্টিকেশন শেষে হোমপেজে বা আপনার ইচ্ছা অনুযায়ী রিডাইরেক্ট করবে
            });
        } catch (err) {
            console.error(err);
            toast.error('Google login failed!');
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

                {/* Header Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                            Register here
                        </Link>
                    </p>
                </div>

                {/* 🌐 Google Login Button */}
                <div>
                    <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer text-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </Button>
                </div>

                {/* Form Divider */}
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">Or email login</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                </div>

                {/* ⚡ HeroUI Form Structure */}
                <Form className="flex flex-col gap-5" onSubmit={onSubmit}>

                    {/* Email Field */}
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        className="w-full flex flex-col gap-1"
                        validate={(value) => {
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                return "Please enter a valid email address";
                            }
                            return null;
                        }}
                    >
                        <Label className="text-sm font-semibold text-gray-700">Email Address</Label>
                        <Input
                            placeholder="user@gadgetlease.com"
                            className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                        />
                        <FieldError className="text-xs text-red-500 font-medium mt-1" />
                    </TextField>

                    {/* Password Field */}
                    <TextField
                        isRequired
                        minLength={8}
                        name="password"
                        type="password"
                        className="w-full flex flex-col gap-1"
                        validate={(value) => {
                            if (value.length < 8) {
                                return "Password must be at least 8 characters";
                            }
                            if (!/[A-Z]/.test(value)) {
                                return "Password must contain at least one uppercase letter";
                            }
                            if (!/[0-9]/.test(value)) {
                                return "Password must contain at least one number";
                            }
                            return null;
                        }}
                    >
                        <Label className="text-sm font-semibold text-gray-700">Password</Label>
                        <Input
                            placeholder="Enter your password"
                            className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                        />
                        <Description className="text-xs text-gray-400 mt-1">
                            Must be at least 8 characters with 1 uppercase and 1 number
                        </Description>
                        <FieldError className="text-xs text-red-500 font-medium mt-1" />
                    </TextField>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                        >
                            <Check className="w-4 h-4" />
                            Sign In
                        </Button>
                        <Button
                            type="reset"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-4 rounded-xl transition-all cursor-pointer text-sm"
                        >
                            Reset
                        </Button>
                    </div>
                </Form>

                {/* Demo Credentials Footer */}
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Demo Credentials</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-amber-800 space-y-1">
                    <p><strong>Email:</strong> user@gadgetlease.com</p>
                    <p><strong>Password:</strong> Password123</p>
                </div>

            </div>
        </div>
    );
}


// 'use client';
// import Link from 'next/link';
// import { Check } from "@gravity-ui/icons";
// import { Button, Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";
// import { authClient } from '@/lib/auth-client';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//     const router = useRouter();
//     const { data: session } = authClient.useSession();
//     const role = session?.user?.role;

//     // Form submit handler using FormData
//     const onSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData(e.currentTarget);
//         const user = Object.fromEntries(formData.entries());
//         const { data, error } = await authClient.signIn.email({
//             ...user,
//         });

//         // আপনার লগইন পেজের onSubmit-এর ভেতরের অংশ:
//         if (!error) {
//             toast.success('Login successful');
//             // router.push('/');
//         }
//     };

//     console.log('Role:', role);
//     if (role === 'admin') {
//         router.push('/admin/dashboard');
//     } else {
//         router.push('/');
//     }



//     // Google Login Handler
//     const handleGoogleLogin = () => {
//         authClient.signIn.social({ provider: 'google' });
//         toast.success('Login successful! Redirecting to home page...');
//         router.push('/'); // Redirect to home after Google login
//     };

//     return (
//         <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

//                 {/* Header Section */}
//                 <div className="text-center">
//                     <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
//                     <p className="mt-2 text-sm text-gray-500">
//                         Don't have an account?{' '}
//                         <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
//                             Register here
//                         </Link>
//                     </p>
//                 </div>

//                 {/* Alert Notification
//                 {successMessage && (
//                     <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium">
//                         {successMessage}
//                     </div>
//                 )} */}

//                 {/* 🌐 Google Login Button */}
//                 <div>
//                     <Button
//                         type="button"
//                         onClick={handleGoogleLogin}
//                         className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer text-sm"
//                     >
//                         {/* Official Google Icon SVG */}
//                         <svg className="w-5 h-5" viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//                             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//                             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
//                             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
//                         </svg>
//                         Continue with Google
//                     </Button>
//                 </div>

//                 {/* Form Divider */}
//                 <div className="relative flex py-2 items-center">
//                     <div className="flex-grow border-t border-gray-100"></div>
//                     <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">Or email login</span>
//                     <div className="flex-grow border-t border-gray-100"></div>
//                 </div>

//                 {/* ⚡ HeroUI v3.x Form Structure */}
//                 <Form className="flex flex-col gap-5" onSubmit={onSubmit}>

//                     {/* Email Field */}
//                     <TextField
//                         isRequired
//                         name="email"
//                         type="email"
//                         className="w-full flex flex-col gap-1"
//                         validate={(value) => {
//                             if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
//                                 return "Please enter a valid email address";
//                             }
//                             return null;
//                         }}
//                     >
//                         <Label className="text-sm font-semibold text-gray-700">Email Address</Label>
//                         <Input
//                             placeholder="user@gadgetlease.com"
//                             className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
//                         />
//                         <FieldError className="text-xs text-red-500 font-medium mt-1" />
//                     </TextField>

//                     {/* Password Field */}
//                     <TextField
//                         isRequired
//                         minLength={8}
//                         name="password"
//                         type="password"
//                         className="w-full flex flex-col gap-1"
//                         validate={(value) => {
//                             if (value.length < 8) {
//                                 return "Password must be at least 8 characters";
//                             }
//                             if (!/[A-Z]/.test(value)) {
//                                 return "Password must contain at least one uppercase letter";
//                             }
//                             if (!/[0-9]/.test(value)) {
//                                 return "Password must contain at least one number";
//                             }
//                             return null;
//                         }}
//                     >
//                         <Label className="text-sm font-semibold text-gray-700">Password</Label>
//                         <Input
//                             placeholder="Enter your password"
//                             className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
//                         />
//                         <Description className="text-xs text-gray-400 mt-1">
//                             Must be at least 8 characters with 1 uppercase and 1 number
//                         </Description>
//                         <FieldError className="text-xs text-red-500 font-medium mt-1" />
//                     </TextField>

//                     {/* Action Buttons */}
//                     <div className="flex gap-3 pt-2">
//                         <Button
//                             type="submit"
//                             className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
//                         >
//                             <Check className="w-4 h-4" />
//                             Sign In
//                         </Button>
//                         <Button
//                             type="reset"
//                             className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-4 rounded-xl transition-all cursor-pointer text-sm"
//                         >
//                             Reset
//                         </Button>
//                     </div>
//                 </Form>

//                 {/* Demo Credentials Footer */}
//                 <div className="relative flex py-2 items-center">
//                     <div className="flex-grow border-t border-gray-100"></div>
//                     <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Demo Credentials</span>
//                     <div className="flex-grow border-t border-gray-100"></div>
//                 </div>

//                 <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-amber-800 space-y-1">
//                     <p><strong>Email:</strong> user@gadgetlease.com</p>
//                     <p><strong>Password:</strong> Password123</p>
//                 </div>

//             </div>
//         </div>
//     );
// }