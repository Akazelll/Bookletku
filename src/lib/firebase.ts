import { getApp, getApps, initializeApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdfSnmSEs2rSxo8pIzaJLDLDWD3b9RpAc",
  authDomain: "bookletku-react.firebaseapp.com",
  projectId: "bookletku-react",
  storageBucket: "bookletku-react.firebasestorage.app",
  messagingSenderId: "104971554138",
  appId: "1:104971554138:web:453f56aba7ac6621d4b763",
  measurementId: "G-DPZQLLR7TT",
};

// 1. Initialize App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Firestore (ANTI-MACET)
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true, // Wajib true agar koneksi stabil
    localCache: undefined, // Matikan cache agar data selalu fresh
  },
  "bookletku-react"
);

// 3. Initialize Storage
export const storage = getStorage(app);

// 4. Initialize Analytics (Client Only)
let analyticsInstance: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analyticsInstance = getAnalytics(app);
      }
    })
    .catch((err) => console.error("Analytics init error:", err));
}

// PENTING: Export variabel analytics agar bisa di-import file lain
export const analytics = analyticsInstance;
