// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore/lite";
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

// 2. Inisialisasi Services
const db = getFirestore(app);
const storage = getStorage(app);

// 3. Inisialisasi Analytics (Hanya di Browser)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Analytics tidak didukung di lingkungan ini:", err);
    });
}

// 4. Export Semuanya
export { app, db, storage, analytics };