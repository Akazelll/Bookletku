export type MenuItem = {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
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
};

export const CATEGORIES = [
  "Makanan Utama",
  "Minuman",
  "Cemilan",
  "Dessert",
  "Paket Hemat",
];
