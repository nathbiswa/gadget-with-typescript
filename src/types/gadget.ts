// src/types/gadget.ts

export interface Specification {
  label: string; // যেমন: "Sensor"
  value: string; // যেমন: "33MP Full-Frame"
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Gadget {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string; // নতুন যুক্ত হলো
  images: string[];        // একাধিক ইমেজের জন্য স্ট্রিং অ্যারে (নতুন)
  pricePerDay: number;
  rating: number;
  location: string;
  availableDate: string;
  category: string;
  specifications: Specification[]; // নেস্টেড ইন্টারফেস অ্যারে (নতুন)
  reviews: Review[];               // নেস্টেড ইন্টারফেস অ্যারে (নতুন)
}