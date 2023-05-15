import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDUfiDOrRPmL6GBTsPKQ9fkQszlZf6YIOI",
  authDomain: "chat-31059.firebaseapp.com",
  projectId: "chat-31059",
  storageBucket: "chat-31059.appspot.com",
  messagingSenderId: "389764601291",
  appId: "1:389764601291:web:860827bfd0182ef0a2524e",
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();