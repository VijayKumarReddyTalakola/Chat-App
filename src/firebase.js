import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCHGkUF3lJItK_srs2vo-ayF67HTPDvIIE",
  authDomain: "chat-app-816cd.firebaseapp.com",
  projectId: "chat-app-816cd",
  storageBucket: "chat-app-816cd.appspot.com",
  messagingSenderId: "223643729105",
  appId: "1:223643729105:web:ed9499f065144043b4d9f0",
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();