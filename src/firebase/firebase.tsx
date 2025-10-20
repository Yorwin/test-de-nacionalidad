// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC3OK-TRXupo1qTjPnsEHhUkz0uqZ0PSwg",
    authDomain: "web-prueba-ccse.firebaseapp.com",
    projectId: "web-prueba-ccse",
    storageBucket: "web-prueba-ccse.firebasestorage.app",
    messagingSenderId: "180029201868",
    appId: "1:180029201868:web:3161c5fda5116f22f51169",
    measurementId: "G-PG7N58VQCQ"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore();