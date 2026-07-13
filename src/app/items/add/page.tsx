'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Check } from "@gravity-ui/icons";
import { Button, Form, Input, Label, TextField, FieldError } from "@heroui/react";
import { toast } from 'react-toastify';

export default function AddItemPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // 📸 ইমেজ আপলোডের জন্য স্টেট এবং রেফারেন্স
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    // 🔒 প্রটেক্টেড পেজ লজিক: লগইন না থাকলে রিডাইরেক্ট
    useEffect(() => {
        if (!isPending && !session?.user) {
            router.push('/login');
        }
    }, [session, isPending, router]);

    const handleZoneClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedImages((prev) => [...prev, ...filesArray]);
        }
    };

    // 🚀 ImgBB-তে ইমেজ আপলোড করার হেল্পার ফাংশন
    const uploadToImgBB = async (file: File): Promise<string> => {
        const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_URL;
        if (!apiKey) {
            throw new Error("ImgBB API Key is missing in environment variables.");
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (result.success) {
            return result.data.url;
        } else {
            throw new Error(result.error?.message || "Failed to upload image to ImgBB");
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!session?.user?.id) {
            setErrorMessage("You must be logged in to list an item.");
            return;
        }

        if (selectedImages.length === 0) {
            setErrorMessage("Please select at least one image for your gadget.");
            return;
        }

        setLoading(true);

        try {
            // ১. নির্বাচিত সব ইমেজ ImgBB-তে আপলোড করা হচ্ছে
            const uploadedImageUrls = await Promise.all(
                selectedImages.map((file) => uploadToImgBB(file))
            );

            const formData = new FormData(e.target as HTMLFormElement);

            // ২. ব্যাকএন্ডের জন্য পেলোড তৈরি
            const payload = {
                title: formData.get('title'),
                pricePerDay: Number(formData.get('price')),
                category: formData.get('category'),
                location: formData.get('location'),
                availableDate: formData.get('availableDate'),
                shortDescription: formData.get('description'),
                fullDescription: formData.get('description'),
                images: uploadedImageUrls, // 🎯 ImgBB থেকে পাওয়া আসল লিঙ্কগুলো যাচ্ছে
                userId: session.user.id
            };
            console.log("Payload to be sent:", payload);
            // ৩. ব্যাকএন্ড API-তে ডাটা পাঠানো
            const response = await fetch('http://localhost:5000/api/items/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('🎉 Gadget successfully submitted! Waiting for admin approval.');
                setSuccessMessage('🎉 Gadget successfully submitted! Waiting for admin approval.');
                e.currentTarget.reset();
                setSelectedImages([]);
            } else {
                toast.error(result.message || 'Something went wrong.');
                setErrorMessage(result.message || 'Something went wrong.');
            }
        } catch (error: any) {
            console.error("Submission Error:", error);
            setErrorMessage(error.message || 'Failed to complete the operation.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSuccessMessage('');
        setErrorMessage('');
        setSelectedImages([]);
    };

    if (isPending) return <div className="text-center py-20">Loading session matrix...</div>;
    if (!session?.user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

                {/* Page Header */}
                <div className="mb-8 border-b border-gray-100 pb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">List a New Gadget</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Fill in the details below to make your premium tech gear available for rent.
                    </p>
                </div>

                {/* Status Messages */}
                {successMessage && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                        ❌ {errorMessage}
                    </div>
                )}

                {/* ⚡ HeroUI v3 Form Component */}
                <Form className="flex flex-col gap-6" onSubmit={onSubmit} onReset={handleReset}>

                    {/* Gadget Title */}
                    <TextField
                        isRequired
                        name="title"
                        type="text"
                        className="w-full flex flex-col gap-1"
                        validate={(value) => {
                            if (value.trim().length < 5) {
                                return "Title must be at least 5 characters long";
                            }
                            return null;
                        }}
                    >
                        <Label className="text-sm font-semibold text-gray-700">Gadget Title</Label>
                        <Input placeholder="e.g., Sony FE 24-70mm f/2.8 GM II Lens" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
                        <FieldError className="text-xs text-red-500 font-medium mt-1" />
                    </TextField>

                    {/* Price per Day & Category Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextField
                            isRequired
                            name="price"
                            type="number"
                            className="w-full flex flex-col gap-1"
                            validate={(value) => {
                                if (Number(value) <= 0) {
                                    return "Price must be a positive number greater than 0";
                                }
                                return null;
                            }}
                        >
                            <Label className="text-sm font-semibold text-gray-700">Rental Price (per Day)</Label>
                            <Input placeholder="৳ Price in BDT" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
                            <FieldError className="text-xs text-red-500 font-medium mt-1" />
                        </TextField>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <select
                                name="category"
                                required
                                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none text-gray-800 cursor-pointer h-[40px]"
                            >
                                <option value="Cameras">Cameras</option>
                                <option value="Drones">Drones</option>
                                <option value="Laptops">Laptops</option>
                                <option value="Audio">Audio & Sound</option>
                            </select>
                        </div>
                    </div>

                    {/* Location & Available Date Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextField
                            isRequired
                            name="location"
                            type="text"
                            className="w-full flex flex-col gap-1"
                        >
                            <Label className="text-sm font-semibold text-gray-700">Hub / Pickup Location</Label>
                            <Input placeholder="e.g., Banani, Dhaka" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
                            <FieldError className="text-xs text-red-500 font-medium mt-1" />
                        </TextField>

                        <TextField
                            isRequired
                            name="availableDate"
                            type="date"
                            className="w-full flex flex-col gap-1"
                        >
                            <Label className="text-sm font-semibold text-gray-700">Available From</Label>
                            <Input className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
                            <FieldError className="text-xs text-red-500 font-medium mt-1" />
                        </TextField>
                    </div>

                    {/* Description Block */}
                    <TextField
                        isRequired
                        name="description"
                        type="text"
                        className="w-full flex flex-col gap-1"
                        validate={(value) => {
                            if (value.trim().length < 20) {
                                return "Provide at least 20 characters summarizing item condition";
                            }
                            return null;
                        }}
                    >
                        <Label className="text-sm font-semibold text-gray-700">Short Overview / Description</Label>
                        <Input placeholder="Describe the item's condition and rental terms..." className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-4 text-sm focus:outline-none text-gray-800" />
                        <FieldError className="text-xs text-red-500 font-medium mt-1" />
                    </TextField>

                    {/* 📸 সচল ইমেজ আপলোড বাটন */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Upload Media Images</label>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            accept="image/png, image/jpeg, image/jpg"
                            className="hidden"
                        />

                        <div
                            onClick={handleZoneClick}
                            className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 transition-colors"
                        >
                            <span className="text-2xl block mb-1">📸</span>
                            <span className="text-xs font-semibold text-indigo-600 block">Click to upload multiple images</span>
                            <span className="text-[10px] text-gray-400">Supports PNG, JPG, JPEG up to 5MB</span>
                        </div>

                        {/* নির্বাচিত ইমেজ ট্র্যাকার কাউন্টার */}
                        {selectedImages.length > 0 && (
                            <div className="mt-2 flex flex-col gap-1">
                                <p className="text-xs text-emerald-600 font-bold">
                                    📑 Selected {selectedImages.length} images ready for uploading.
                                </p>
                                <div className="text-[11px] text-gray-500 max-h-20 overflow-y-auto bg-gray-100 p-2 rounded-lg">
                                    {selectedImages.map((file, idx) => (
                                        <div key={idx} className="truncate">• {file.name}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <Button
                            type="submit"
                            isDisabled={loading}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                        >
                            <Check className="w-4 h-4" />
                            {loading ? 'Uploading Images & Publishing...' : 'Publish Listing'}
                        </Button>
                        <Button
                            type="reset"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-6 rounded-xl transition-all cursor-pointer text-sm"
                        >
                            Reset Form
                        </Button>
                    </div>

                </Form>
            </div>
        </div>
    );
}



// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { authClient } from '@/lib/auth-client';
// import { Check } from "@gravity-ui/icons";
// import { Button, Form, Input, Label, TextField, FieldError } from "@heroui/react";

// export default function AddItemPage() {
//     const router = useRouter();
//     const { data: session, isPending } = authClient.useSession();

//     const [successMessage, setSuccessMessage] = useState<string>('');
//     const [errorMessage, setErrorMessage] = useState<string>('');
//     const [loading, setLoading] = useState<boolean>(false);

//     // 📸 ইমেজ আপলোডের জন্য স্টেট এবং রেফারেন্স
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [selectedImages, setSelectedImages] = useState<File[]>([]);

//     // 🔒 প্রটেক্টেড পেজ লজিক: লগইন না থাকলে রিডাইরেক্ট
//     useEffect(() => {
//         if (!isPending && !session?.user) {
//             router.push('/login');
//         }
//     }, [session, isPending, router]);

//     const handleZoneClick = () => {
//         fileInputRef.current?.click();
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             const filesArray = Array.from(e.target.files);
//             setSelectedImages((prev) => [...prev, ...filesArray]);
//         }
//     };

//     const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         setSuccessMessage('');
//         setErrorMessage('');

//         if (!session?.user?.id) {
//             setErrorMessage("You must be logged in to list an item.");
//             return;
//         }

//         setLoading(true);

//         const formData = new FormData(e.currentTarget);

//         // 💡 যদি ব্যাকএন্ড সরাসরি ইমেজ ফাইল হ্যান্ডেল না করে টেক্সট নেয়, তাহলে প্লেসহোল্ডার ইমেজ পাঠাবো।
//         // পরে মাল্টার (Multer) সেটআপ করলে সরাসরি selectedImages ফাইলগুলো FormData-তে পাঠানো যাবে।
//         const dummyImages = ['https://placehold.co/600x400'];

//         const payload = {
//             title: formData.get('title'),
//             pricePerDay: Number(formData.get('price')),
//             category: formData.get('category'),
//             location: formData.get('location'),
//             availableDate: formData.get('availableDate'),
//             shortDescription: formData.get('description'),
//             fullDescription: formData.get('description'), // শর্ট ডেসক্রিপশনটাই ফুল হিসেবে ব্যাকআপ রাখছি
//             images: dummyImages,
//             userId: session.user.id // 🎯 ইউজারের ওনারশিপ ট্র্যাক করার আইডি
//         };

//         try {
//             const response = await fetch('http://localhost:5000/api/items/add', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(payload),
//             });

//             const result = await response.json();

//             if (result.success) {
//                 setSuccessMessage('🎉 Gadget successfully submitted! Waiting for admin approval.');
//                 e.currentTarget.reset();
//                 setSelectedImages([]);
//             } else {
//                 setErrorMessage(result.message || 'Something went wrong.');
//             }
//         } catch (error) {
//             console.error("Submission Error:", error);
//             setErrorMessage('Failed to connect to the server.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleReset = () => {
//         setSuccessMessage('');
//         setErrorMessage('');
//         setSelectedImages([]);
//     };

//     if (isPending) return <div className="text-center py-20">Loading session matrix...</div>;
//     if (!session?.user) return null;

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

//                 {/* Page Header */}
//                 <div className="mb-8 border-b border-gray-100 pb-4">
//                     <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">List a New Gadget</h1>
//                     <p className="mt-2 text-sm text-gray-500">
//                         Fill in the details below to make your premium tech gear available for rent.
//                     </p>
//                 </div>

//                 {/* Status Messages */}
//                 {successMessage && (
//                     <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium">
//                         {successMessage}
//                     </div>
//                 )}
//                 {errorMessage && (
//                     <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
//                         ❌ {errorMessage}
//                     </div>
//                 )}

//                 {/* ⚡ HeroUI v3 Form Component */}
//                 <Form className="flex flex-col gap-6" onSubmit={onSubmit} onReset={handleReset}>

//                     {/* Gadget Title */}
//                     <TextField
//                         isRequired
//                         name="title"
//                         type="text"
//                         className="w-full flex flex-col gap-1"
//                         validate={(value) => {
//                             if (value.trim().length < 5) {
//                                 return "Title must be at least 5 characters long";
//                             }
//                             return null;
//                         }}
//                     >
//                         <Label className="text-sm font-semibold text-gray-700">Gadget Title</Label>
//                         <Input placeholder="e.g., Sony FE 24-70mm f/2.8 GM II Lens" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
//                         <FieldError className="text-xs text-red-500 font-medium mt-1" />
//                     </TextField>

//                     {/* Price per Day & Category Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <TextField
//                             isRequired
//                             name="price"
//                             type="number"
//                             className="w-full flex flex-col gap-1"
//                             validate={(value) => {
//                                 if (Number(value) <= 0) {
//                                     return "Price must be a positive number greater than 0";
//                                 }
//                                 return null;
//                             }}
//                         >
//                             <Label className="text-sm font-semibold text-gray-700">Rental Price (per Day)</Label>
//                             <Input placeholder="৳ Price in BDT" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
//                             <FieldError className="text-xs text-red-500 font-medium mt-1" />
//                         </TextField>

//                         <div className="flex flex-col gap-1">
//                             <label className="text-sm font-semibold text-gray-700">Category</label>
//                             <select
//                                 name="category"
//                                 required
//                                 className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none text-gray-800 cursor-pointer h-[40px]"
//                             >
//                                 <option value="Cameras">Cameras</option>
//                                 <option value="Drones">Drones</option>
//                                 <option value="Laptops">Laptops</option>
//                                 <option value="Audio">Audio & Sound</option>
//                             </select>
//                         </div>
//                     </div>

//                     {/* Location & Available Date Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <TextField
//                             isRequired
//                             name="location"
//                             type="text"
//                             className="w-full flex flex-col gap-1"
//                         >
//                             <Label className="text-sm font-semibold text-gray-700">Hub / Pickup Location</Label>
//                             <Input placeholder="e.g., Banani, Dhaka" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
//                             <FieldError className="text-xs text-red-500 font-medium mt-1" />
//                         </TextField>

//                         <TextField
//                             isRequired
//                             name="availableDate"
//                             type="date"
//                             className="w-full flex flex-col gap-1"
//                         >
//                             <Label className="text-sm font-semibold text-gray-700">Available From</Label>
//                             <Input className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
//                             <FieldError className="text-xs text-red-500 font-medium mt-1" />
//                         </TextField>
//                     </div>

//                     {/* Description Block */}
//                     <TextField
//                         isRequired
//                         name="description"
//                         type="text"
//                         className="w-full flex flex-col gap-1"
//                         validate={(value) => {
//                             if (value.trim().length < 20) {
//                                 return "Provide at least 20 characters summarizing item condition";
//                             }
//                             return null;
//                         }}
//                     >
//                         <Label className="text-sm font-semibold text-gray-700">Short Overview / Description</Label>
//                         <Input placeholder="Describe the item's condition and rental terms..." className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-4 text-sm focus:outline-none text-gray-800" />
//                         <FieldError className="text-xs text-red-500 font-medium mt-1" />
//                     </TextField>

//                     {/* 📸 সচল ইমেজ আপলোড বাটন */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm font-semibold text-gray-700">Upload Media Images</label>

//                         <input
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={handleFileChange}
//                             multiple
//                             accept="image/png, image/jpeg, image/jpg"
//                             className="hidden"
//                         />

//                         <div
//                             onClick={handleZoneClick}
//                             className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 transition-colors"
//                         >
//                             <span className="text-2xl block mb-1">📸</span>
//                             <span className="text-xs font-semibold text-indigo-600 block">Click to upload multiple images</span>
//                             <span className="text-[10px] text-gray-400">Supports PNG, JPG, JPEG up to 5MB</span>
//                         </div>

//                         {/* নির্বাচিত ইমেজ ট্র্যাকার কাউন্টার */}
//                         {selectedImages.length > 0 && (
//                             <p className="text-xs text-emerald-600 font-bold mt-1">
//                                 📑 Selected {selectedImages.length} images ready for parsing.
//                             </p>
//                         )}
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex gap-4 pt-4 border-t border-gray-100">
//                         <Button
//                             type="submit"
//                             isDisabled={loading}
//                             className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
//                         >
//                             <Check className="w-4 h-4" />
//                             {loading ? 'Publishing...' : 'Publish Listing'}
//                         </Button>
//                         <Button
//                             type="reset"
//                             className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-6 rounded-xl transition-all cursor-pointer text-sm"
//                         >
//                             Reset Form
//                         </Button>
//                     </div>

//                 </Form>
//             </div>
//         </div>
//     );
// }


// // 'use client';

// // import { useState } from 'react';
// // import { Check } from "@gravity-ui/icons";
// // import { Button, Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";

// // export default function AddItemPage() {
// //     const [successMessage, setSuccessMessage] = useState<string>('');

// //     const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// //         e.preventDefault();
// //         setSuccessMessage('');

// //         const formData = new FormData(e.currentTarget);
// //         const data: Record<string, string> = {};

// //         formData.forEach((value, key) => {
// //             data[key] = value.toString();
// //         });

// //         // Form submission processing mock
// //         setSuccessMessage('Gadget successfully listed for rental market!');
// //         e.currentTarget.reset();
// //     };

// //     return (
// //         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //             <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

// //                 {/* Page Header */}
// //                 <div className="mb-8 border-b border-gray-100 pb-4">
// //                     <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">List a New Gadget</h1>
// //                     <p className="mt-2 text-sm text-gray-500">
// //                         Fill in the details below to make your premium tech gear available for rent.
// //                     </p>
// //                 </div>

// //                 {/* Alert Notification */}
// //                 {successMessage && (
// //                     <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium">
// //                         ✅ {successMessage}
// //                     </div>
// //                 )}

// //                 {/* ⚡ HeroUI v3 Form Component */}
// //                 <Form className="flex flex-col gap-6" onSubmit={onSubmit}>

// //                     {/* Gadget Title */}
// //                     <TextField
// //                         isRequired
// //                         name="title"
// //                         type="text"
// //                         className="w-full flex flex-col gap-1"
// //                         validate={(value) => {
// //                             if (value.trim().length < 5) {
// //                                 return "Title must be at least 5 characters long";
// //                             }
// //                             return null;
// //                         }}
// //                     >
// //                         <Label className="text-sm font-semibold text-gray-700">Gadget Title</Label>
// //                         <Input placeholder="e.g., Sony FE 24-70mm f/2.8 GM II Lens" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
// //                         <FieldError className="text-xs text-red-500 font-medium mt-1" />
// //                     </TextField>

// //                     {/* Price per Day & Category Row */}
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                         <TextField
// //                             isRequired
// //                             name="price"
// //                             type="number"
// //                             className="w-full flex flex-col gap-1"
// //                             validate={(value) => {
// //                                 if (Number(value) <= 0) {
// //                                     return "Price must be a positive number greater than 0";
// //                                 }
// //                                 return null;
// //                             }}
// //                         >
// //                             <Label className="text-sm font-semibold text-gray-700">Rental Price (per Day)</Label>
// //                             <Input placeholder="৳ Price in BDT" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
// //                             <FieldError className="text-xs text-red-500 font-medium mt-1" />
// //                         </TextField>

// //                         <div className="flex flex-col gap-1">
// //                             <label className="text-sm font-semibold text-gray-700">Category</label>
// //                             <select
// //                                 name="category"
// //                                 required
// //                                 className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none text-gray-800 cursor-pointer h-[40px]"
// //                             >
// //                                 <option value="Cameras">Cameras</option>
// //                                 <option value="Drones">Drones</option>
// //                                 <option value="Laptops">Laptops</option>
// //                                 <option value="Audio">Audio & Sound</option>
// //                             </select>
// //                         </div>
// //                     </div>

// //                     {/* Location & Available Date Row */}
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                         <TextField
// //                             isRequired
// //                             name="location"
// //                             type="text"
// //                             className="w-full flex flex-col gap-1"
// //                         >
// //                             <Label className="text-sm font-semibold text-gray-700">Hub / Pickup Location</Label>
// //                             <Input placeholder="e.g., Banani, Dhaka" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
// //                             <FieldError className="text-xs text-red-500 font-medium mt-1" />
// //                         </TextField>

// //                         <TextField
// //                             isRequired
// //                             name="availableDate"
// //                             type="date"
// //                             className="w-full flex flex-col gap-1"
// //                         >
// //                             <Label className="text-sm font-semibold text-gray-700">Available From</Label>
// //                             <Input className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm focus:outline-none text-gray-800" />
// //                             <FieldError className="text-xs text-red-500 font-medium mt-1" />
// //                         </TextField>
// //                     </div>

// //                     {/* Description Block */}
// //                     <TextField
// //                         isRequired
// //                         name="description"
// //                         type="text"
// //                         className="w-full flex flex-col gap-1"
// //                         validate={(value) => {
// //                             if (value.trim().length < 20) {
// //                                 return "Provide at least 20 characters summarizing item condition";
// //                             }
// //                             return null;
// //                         }}
// //                     >
// //                         <Label className="text-sm font-semibold text-gray-700">Short Overview / Description</Label>
// //                         <Input placeholder="Describe the item's condition and rental terms..." className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-4 text-sm focus:outline-none text-gray-800" />
// //                         <FieldError className="text-xs text-red-500 font-medium mt-1" />
// //                     </TextField>

// //                     {/* Image Upload Placeholder Component */}
// //                     <div className="flex flex-col gap-2">
// //                         <label className="text-sm font-semibold text-gray-700">Upload Media Images</label>
// //                         <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 transition-colors">
// //                             <span className="text-2xl block mb-1">📸</span>
// //                             <span className="text-xs font-semibold text-indigo-600 block">Click to uploadtt multiple images</span>

// //                             <span className="text-[10px] text-gray-400">Supports PNG, JPG, JPEG up to 5MB</span>
// //                         </div>
// //                     </div>

// //                     {/* Action Buttons */}
// //                     <div className="flex gap-4 pt-4 border-t border-gray-100">
// //                         <Button
// //                             type="submit"
// //                             className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
// //                         >
// //                             <Check className="w-4 h-4" />
// //                             Publish Listing
// //                         </Button>
// //                         <Button
// //                             type="reset"
// //                             className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-6 rounded-xl transition-all cursor-pointer text-sm"
// //                         >
// //                             Reset Form
// //                         </Button>
// //                     </div>

// //                 </Form>
// //             </div>
// //         </div>
// //     );
// // }