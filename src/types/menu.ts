export type MenuItem = {
<<<<<<< HEAD
  id?: string; // ID dari Firebase (opsional saat create)
=======
  id?: string;
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
  name: string;
  description: string;
  price: number;
  category: string;
<<<<<<< HEAD
  imageUrl?: string; // URL foto dari Firebase Storage
  isAvailable: boolean;
  createdAt: number;
=======
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: number;
  user_id?: string;
};

export type RestaurantProfile = {
  id: string;
  restaurantName: string;
  whatsappNumber: string;
  theme: string;
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
};

export const CATEGORIES = [
  "Makanan Utama",
  "Minuman",
  "Cemilan",
  "Dessert",
  "Paket Hemat",
<<<<<<< HEAD
];
=======
];
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
