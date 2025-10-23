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
import { getFullDate, getCurrentSecondsSinceMidNight } from "@/functions/functions";
import { SaveResults } from "@/types/types";
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

//Función para guardar resultados de Test.

export const saveResultsTest = async ({ testId, score, answers, duration, questions }: SaveResults) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const result = {
      userId: user.uid,
      testId,
      Date: getFullDate(),
      secondsSinceMidNight: getCurrentSecondsSinceMidNight(),
      score,
      answers,
      duration,
      questions: JSON.stringify(questions),
    }

    //Guardar en FireStore
    const docRef = await addDoc(collection(db, 'users', user.uid, 'resultados'), result);
    return docRef.id;

  } catch (error) {
    console.error('Error al guardar resultado:', error)
    throw error;
  }
};