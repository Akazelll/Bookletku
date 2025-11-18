// src/lib/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdfSnmSEs2rSxo8pIzaJLDLDWD3b9RpAc",
  authDomain: "bookletku-react.firebaseapp.com",
  projectId: "bookletku-react",
  // PERHATIAN: Pastikan ini sesuai dengan yang ada di Firebase Console -> Storage
  // Coba ganti ke "bookletku-react.appspot.com" jika yang ini gagal
  storageBucket: "bookletku-react.firebasestorage.app",
  messagingSenderId: "104971554138",
  appId: "1:104971554138:web:453f56aba7ac6621d4b763",
  measurementId: "G-DPZQLLR7TT",
};

// 1. Initialize App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Firestore (Modern Cache Setup)
const isBrowser = typeof window !== "undefined";
let firestoreInstance: Firestore;

if (isBrowser) {
  firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} else {
  const globalWithFirestore = global as typeof globalThis & {
    _firebaseFirestore?: Firestore;
  };
  if (!globalWithFirestore._firebaseFirestore) {
    globalWithFirestore._firebaseFirestore = initializeFirestore(app, {});
  }
  firestoreInstance = globalWithFirestore._firebaseFirestore;
}

export const db = firestoreInstance;
export const storage = getStorage(app);

// 3. Initialize Analytics
let analyticsInstance: Analytics | null = null;
if (isBrowser) {
  isSupported()
    .then((supported) => {
      if (supported) analyticsInstance = getAnalytics(app);
    })
    .catch(console.error);
}
export { analyticsInstance as analytics };
