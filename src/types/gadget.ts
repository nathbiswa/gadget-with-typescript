// src/types/gadget.ts

export interface Gadget {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  pricePerDay: number;
  rating: number;
  location: string;
  availableDate: string; // কবে থেকে পাওয়া যাবে
}