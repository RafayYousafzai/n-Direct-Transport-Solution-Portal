"use client";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXYJck4kQxh4hop3BblpVhrgYDKcXSsIc",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig);
const realtimeDb = getDatabase(app);
const auth = getAuth(app);

// Firebase Configuration for Location-Tracking App
const firebaseConfigOFL = {
  apiKey: "AIzaSyD77nzoV_f6OnA2ebI6Ln-vj6V-0kNZWa8",
  authDomain: "location-tracking-9122b.firebaseapp.com",
  projectId: "location-tracking-9122b",
  storageBucket: "location-tracking-9122b.firebasestorage.app",
  messagingSenderId: "476599892713",
  appId: "1:476599892713:web:5a647dc2a720e89c9e8e78",
};

async function authenticate(apiKey) {
  try {
    const response = await fetch(
      `https://getaccesstoken-luo7djln7q-uc.a.run.app/?apiKey=${apiKey}`
    );
    const data = await response.json();
    console.log({ data });

    if (data.token) {
      await signInWithCustomToken(auth, data.token);
      console.log("Authenticated successfully!");
    } else {
      console.error("Failed authentication:", data.error);
    }
  } catch (error) {
    console.error("Error authenticating:", error);
  }
}

// 🔹 Call Authentication After Initialization
(async () => {
  await authenticate(firebaseConfig.apiKey);
})();

const appOFL = initializeApp(firebaseConfigOFL, "locationTrackingApp");

const realtimeDbOFL = getDatabase(appOFL);
const db = getFirestore(app);

export { app, db, realtimeDb, realtimeDbOFL };
