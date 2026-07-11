'use client';

import { useState } from 'react';
import { Check } from "@gravity-ui/icons";
import { Button, Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";

export default function AddItemPage() {
    const [successMessage, setSuccessMessage] = useState<string>('');

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage('');

        const formData = new FormData(e.currentTarget);
        const data: Record<string, string> = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        // Form submission processing mock
        setSuccessMessage('Gadget successfully listed for rental market!');
        e.currentTarget.reset();
    };

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

                {/* Alert Notification */}
                {successMessage && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium">
                        ✅ {successMessage}
                    </div>
                )}

                {/* ⚡ HeroUI v3 Form Component */}
                <Form className="flex flex-col gap-6" onSubmit={onSubmit}>

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

                    {/* Image Upload Placeholder Component */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Upload Media Images</label>
                        <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer bg-gray-50/50 transition-colors">
                            <span className="text-2xl block mb-1">📸</span>
                            <span className="text-xs font-semibold text-indigo-600 block">Click to upload multiple images</span>
                            <span className="text-[10px] text-gray-400">Supports PNG, JPG, JPEG up to 5MB</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <Button
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                        >
                            <Check className="w-4 h-4" />
                            Publish Listing
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