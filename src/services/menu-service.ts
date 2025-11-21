import { MenuItem } from "@/types/menu";

// DATA DUMMY
let MOCK_MENUS: MenuItem[] = [
  {
    id: "1",
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, ayam suwir, dan sate ayam.",
    price: 25000,
    category: "Makanan Utama",
    imageUrl:
      "https://images.unsplash.com/photo-1603133872878-684f57df8cca?w=800&q=80",
    isAvailable: true,
    createdAt: Date.now(),
  },
  {
    id: "2",
    name: "Es Teh Manis Jumbo",
    description: "Teh manis dingin ukuran jumbo segar.",
    price: 5000,
    category: "Minuman",
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
    isAvailable: true,
    createdAt: Date.now(),
  },
  {
    id: "3",
    name: "Roti Bakar Coklat Keju",
    description: "Roti bakar tebal dengan topping melimpah.",
    price: 15000,
    category: "Cemilan",
    imageUrl:
      "https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=800&q=80",
    isAvailable: true,
    createdAt: Date.now(),
  },
];

// --- FUNGSI SERVICE (TANPA DELAY) ---

export const getMenus = async (): Promise<MenuItem[]> => {
  // HAPUS TIMEOUT DI SINI AGAR INSTAN
  return MOCK_MENUS;
};

export const getMenuById = async (id: string): Promise<MenuItem | null> => {
  return MOCK_MENUS.find((m) => m.id === id) || null;
};

export const createMenu = async (menu: Partial<MenuItem>) => {
  const newItem: MenuItem = {
    ...menu,
    id: Math.random().toString(36).substring(7),
    createdAt: Date.now(),
  } as MenuItem;
  MOCK_MENUS.unshift(newItem);
  return newItem;
};

export const updateMenu = async (id: string, updates: Partial<MenuItem>) => {
  const index = MOCK_MENUS.findIndex((m) => m.id === id);
  if (index !== -1) {
    MOCK_MENUS[index] = { ...MOCK_MENUS[index], ...updates };
    return MOCK_MENUS[index];
  }
  throw new Error("Menu not found");
};

export const deleteMenu = async (id: string) => {
  MOCK_MENUS = MOCK_MENUS.filter((m) => m.id !== id);
};

export const uploadMenuImage = async (file: File): Promise<string> => {
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
};
