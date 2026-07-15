# 💻 GadgetLease — Premium Gadget Rental Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Render](https://img.shields.io/badge/Render-Backend_Hosting-00c497?style=flat-square&logo=render)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend_Hosting-black?style=flat-square&logo=vercel)](https://vercel.com/)

**GadgetLease** is a modern and secure gadget leasing and rental platform. Users can effortlessly explore, filter, and lease premium gadgets. The frontend is built using **Next.js (TypeScript)**, while the backend authentication and database logic are securely managed on **Render.com** using **Node.js/Express** and **Better Auth**.

---

## 🚀 Live Demo

* **Frontend (Vercel):** [gadget-with-typescript.vercel.app](https://gadget-with-typescript.vercel.app)
* **Backend API (Render):** [gadgetlease-server.onrender.com](https://gadgetlease-server.onrender.com)

---

## ✨ Features & Functionalities

* **Secure Google OAuth:** One-click social login powered by Better Auth.
* **Dynamic Gadget Listings:** Advanced search, categorization, and brand-based filtering.
* **Interactive Booking System:** Seamless user experience to rent and track leased gadgets.
* **Responsive & Modern UI:** Designed with Tailwind CSS and Shadcn UI for pixel-perfect cross-device responsiveness.
* **Robust Database Integration:** Scalable data modeling using MongoDB Atlas.
* **Optimized Image Uploads:** Cloud integration via ImgBB API for fast asset delivery.

---

## 🛠️ Tech Stack

### Frontend (Client-side)
* **Framework:** Next.js (TypeScript)
* **Authentication:** Better Auth (Client-side integration)
* **Styling:** Tailwind CSS, Shadcn UI / Aceternity UI
* **Data Fetching:** Axios / React Query

### Backend (Server-side)
* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Mongoose)
* **Authentication Engine:** Better Auth SDK
* **Hosting Platform:** Render.com

---

## ⚙️ Environment Variables Setup

To run this project locally, create a `.env` file in the root directories of both your client and server, then configure the variables as shown below:

### Backend `.env` (`.env.local`)
```env
# Server Port
PORT=5000

# Databases
MONGODB_URI=your_mongodb_connection_string

# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:5000 # Use [https://gadgetlease-server.onrender.com](https://gadgetlease-server.onrender.com) in production

# Google Developer Console Keys
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Base URL Configuration
BASE_URL=http://localhost:5000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000