import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import type { DatabaseReference } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { browser } from "$app/environment";

const firebaseConfig = {
	apiKey: "AIzaSyAUHn9DI0OPOpm5aIM1vNKWPCfGrVZwA-Y",
	authDomain: "project1356-1ff4b.firebaseapp.com",
	databaseURL: "https://project1356-1ff4b-default-rtdb.europe-west1.firebasedatabase.app/",
	projectId: "project1356-1ff4b",
	storageBucket: "project1356-1ff4b.firebasestorage.app",
	messagingSenderId: "186698070234",
	appId: "1:186698070234:web:ae1919386ed9ce78c44de3",
	measurementId: "G-VKZPKTSJHC",
};

/** Firebase app instance */
export const app = initializeApp(firebaseConfig);
/** Firebase Realtime Database instance */
export const database = getDatabase(app);

/** Firebase Analytics instance, null during SSG */
export const analytics: Analytics | null = browser ? getAnalytics(app) : null;
/** Firebase Database reference to the countdown node */
export const countdownRef: DatabaseReference = ref(database, "countdown");
/** Firebase Database reference to the participants node */
export const participantsRef: DatabaseReference = ref(database, "participants");
