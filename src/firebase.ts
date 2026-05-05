import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Replace with actual Firebase config from your console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let db: any = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase initialization failed. Check your config.");
}

export const saveResult = async (result: any) => {
  if (!isFirebaseConfigured || !db) {
    console.warn("Firebase not configured. Result will not be saved online.");
    return null;
  }

  try {
    const savePromise = addDoc(collection(db, "submissions"), {
      ...result,
      createdAt: serverTimestamp(),
    });

    // Wait at most 2 seconds for firebase
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 2000)
    );

    const docRef = await Promise.race([savePromise, timeoutPromise]) as any;
    return docRef.id;
  } catch (e) {
    console.error("Firebase save failed or timed out:", e);
    return null;
  }
};
