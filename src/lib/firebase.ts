// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr1_8fI1UTAx_HdHbTuWVhjd7GU6S3dP0",
  authDomain: "book-reading-app-54dcf.firebaseapp.com",
  projectId: "book-reading-app-54dcf",
  storageBucket: "book-reading-app-54dcf.firebasestorage.app",
  messagingSenderId: "744474644816",
  appId: "1:744474644816:web:47e100f7b2fc0d6c24dc55"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
