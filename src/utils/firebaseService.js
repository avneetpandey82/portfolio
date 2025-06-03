import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

// Function to check if userAgent exists
const checkUserAgentExists = async (userAgent) => {
  try {
    const q = query(
      collection(db, "website-visitors"),
      where("userAgent", "==", userAgent)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking userAgent:", error);
    return false;
  }
};

// Function to add a new entry
export const addEntry = async (entryData) => {
  try {
    // Check if userAgent already exists
    const exists = await checkUserAgentExists(entryData.userAgent);
    if (exists) {
      console.log("User already exists, skipping entry");
      return null;
    }

    console.log(import.meta.env.VITE_API_KEY, "apikey", entryData);
    const docRef = await addDoc(collection(db, "website-visitors"), {
      ...entryData,
      timestamp: serverTimestamp(),
    });
    console.log(docRef, "docRef");
    return { id: docRef.id, ...entryData };
  } catch (error) {
    console.error("Error adding entry: ", error);
    throw error;
  }
};

// Function to get all entries
export const getEntries = async () => {
  try {
    const entriesQuery = query(
      collection(db, "website-visitors"),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(entriesQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting entries: ", error);
    throw error;
  }
};
