export type MenuItem = {
  id?: string; // ID dari Firebase (opsional saat create)
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string; // URL foto dari Firebase Storage
  isAvailable: boolean;
  createdAt: number;
};

export const CATEGORIES = [
  "Makanan Utama",
  "Minuman",
  "Cemilan",
  "Dessert",
  "Paket Hemat",
];
