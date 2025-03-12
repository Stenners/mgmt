import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpc3KI_jZISGvM1PSyq_vmijGG7c1MGAI",
  authDomain: "mgmt-stenners.firebaseapp.com",
  projectId: "mgmt-stenners",
  storageBucket: "mgmt-stenners.firebasestorage.app",
  messagingSenderId: "319683652662",
  appId: "1:319683652662:web:06eda81bdd690e8528fc97",
  measurementId: "G-77XJTJYX1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
