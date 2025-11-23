Bookletku - Your Modern Digital Menu Solution 📱🍽️

Welcome to Bookletku, a comprehensive, self-service digital menu platform designed specifically for MSMEs, cafes, and restaurants. Bookletku empowers business owners to digitize their menu, streamline the ordering process, and enhance customer experience effortlessly.

(Replace with actual screenshot if available)

🌟 Key Features

Instant QR Code Generation: Automatically generate unique QR codes for tables or cashier points. Customers simply scan to access the menu—no app download required! 📷

Seamless WhatsApp Ordering: Orders are formatted and sent directly to your restaurant's WhatsApp number, simplifying communication and order taking. 💬

Real-time Menu Management: Easily add, update, or remove menu items, adjust prices, and manage stock availability instantly from the admin dashboard. ⚡

Optimized Performance: Built with Next.js for a lightning-fast, responsive experience on all devices, ensuring customers don't wait. 🚀

Store Analytics: Gain insights into your business with basic analytics on menu views and popular items. 📊

Cost-Effective: Eliminate the need for reprinting physical menus every time there's a change. Save paper, save money. 💸

Modern & Professional UI: Features a clean, intuitive interface for both admins and customers, built with Shadcn UI and Tailwind CSS. 🎨

Smart Print Templates: Includes a dedicated, print-friendly template for table tents or QR cards. 🖨️

🛠️ Tech Stack

This project is built using a robust and modern technology stack:

Framework: Next.js 15 (App Router) - For server-side rendering and static site generation.

Language: TypeScript - For type safety and better developer experience.

Styling: Tailwind CSS - For rapid and responsive UI development.

UI Components: Shadcn UI - For accessible and customizable components.

Icons: Lucide React - For beautiful and consistent icons.

Backend & Database: Supabase - For authentication, database, and storage.

QR Code: qrcode.react - For generating dynamic QR codes.

Theme Management: next-themes - For light and dark mode support.

🚀 Getting Started

Follow these steps to get a local copy up and running.

Prerequisites

Node.js (v18 or higher recommended)

npm, yarn, pnpm, or bun

Installation

Clone the repository:

git clone [https://github.com/your-username/bookletku.git](https://github.com/your-username/bookletku.git)
cd bookletku


Install dependencies:

npm install
# or
yarn install
# or
pnpm install
# or
bun install


Set up Environment Variables:
Create a .env.local file in the root directory and add your Supabase credentials:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


Run the development server:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


Open your browser:
Navigate to http://localhost:3000 to see the application.

📂 Project Structure

bookletku/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/           # Admin dashboard routes
│   │   ├── login/           # Login/Register page
│   │   ├── menu/            # Public menu view
│   │   └── page.tsx         # Landing page
│   ├── components/          # Reusable React components
│   │   ├── admin/           # Admin-specific components
│   │   └── ui/              # Shadcn UI components
│   ├── lib/                 # Utility functions & libraries (Supabase client, utils)
│   ├── services/            # Business logic & API calls
│   ├── types/               # TypeScript definitions
│   └── middleware.ts        # Middleware for route protection
├── public/                  # Static assets
└── ...config files


📖 Usage

For Restaurant Owners (Admin):

Register/Login: Create an account or log in to access the dashboard.

Set Up Profile: Configure your restaurant name and WhatsApp number in the Settings page.

Manage Menu: Go to Menu List to add items with images, descriptions, prices, and categories.

Get QR Code: Navigate to the QR Code page to preview and print your restaurant's unique QR code card.

For Customers:

Scan QR: Scan the QR code placed on the table.

Browse Menu: View the digital menu, filter by category, and search for items.

Add to Cart: Select items and adjust quantities.

Order: Click "Order via WhatsApp" to send the pre-formatted order details directly to the restaurant.

🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License

Distributed under the MIT License. See LICENSE for more information.

💖 Acknowledgements

Next.js

Supabase

Shadcn UI

Tailwind CSS

Vercel

Dibuat dengan ❤️ di Indonesia for UMKM everywhere.
