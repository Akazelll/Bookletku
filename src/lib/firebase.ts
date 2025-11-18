// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import {
  getFirestore,
  enableIndexedDbPersistence,
  Firestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdfSnmSEs2rSxo8pIzaJLDLDWD3b9RpAc",
  authDomain: "bookletku-react.firebaseapp.com",
  projectId: "bookletku-react",
  storageBucket: "bookletku-react.firebasestorage.app",
  messagingSenderId: "104971554138",
  appId: "1:104971554138:web:453f56aba7ac6621d4b763",
  measurementId: "G-DPZQLLR7TT",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Inisialisasi Firestore (Singleton & Safe)
const isBrowser = typeof window !== "undefined";
let db: Firestore;

if (isBrowser) {
  // Di Client (Browser)
  db = getFirestore(app);
  // Aktifkan Cache Offline
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == "failed-precondition") {
      console.warn("Persistence multiple tabs open");
    } else if (err.code == "unimplemented") {
      console.warn("Persistence not supported");
    }
  });
} else {
  // Di Server (Node.js) - Gunakan global variable untuk dev mode
  // agar tidak membuat koneksi baru setiap hot reload
  const globalWithFirestore = global as typeof globalThis & {
    _firebaseFirestore?: Firestore;
  };

  if (!globalWithFirestore._firebaseFirestore) {
    globalWithFirestore._firebaseFirestore = getFirestore(app);
  }
  db = globalWithFirestore._firebaseFirestore;
}

const storage = getStorage(app);

// 3. Analytics
let analytics: Analytics | null = null;
if (isBrowser) {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(console.error);
}

export { app, db, storage, analytics };
