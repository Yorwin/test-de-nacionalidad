// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  setDoc
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFullDate, getCurrentSecondsSinceMidNight } from "@/functions/functions";
import { SaveResults, SaveResultsModulePractice } from "@/types/types";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage(app);

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

    return {
      userId: user.uid,
      docRef: docRef.id,
    }

  } catch (error) {
    console.error('Error al guardar resultado:', error)
    throw error;
  }
};

// Función para subir preguntas desde JSON
export const uploadQuestions = async (module: number, questions: any[]) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Assuming userData has isAdmin, but check in component
    // For now, proceed

    const collectionName = `Modulo_${module}`;
    const promises = questions.map(async (question) => {
      const { questionNumber, ...questionData } = question;
      const docId = `pregunta_${questionNumber}_${module}`;
      const questionRef = doc(db, collectionName, docId);
      await setDoc(questionRef, questionData);
    });

    await Promise.all(promises);
    console.log('Todas las preguntas subidas exitosamente');
  } catch (error) {
    console.error('Error al subir preguntas:', error);
    throw error;
  }
};

// Función para subir foto de perfil
export const uploadProfilePhoto = async (file: File, userId: string): Promise<string> => {
  try {
    // Validar archivo
    if (!file) throw new Error('No se ha seleccionado ningún archivo');

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Solo se permiten archivos JPEG o PNG');
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('El archivo no puede superar los 5MB');
    }

    // Crear referencia en Storage
    const storageRef = ref(storage, `profile-photos/${userId}/${Date.now()}_${file.name}`);

    // Subir archivo
    const snapshot = await uploadBytes(storageRef, file);

    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Actualizar documento del usuario en Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      profilePhotoURL: downloadURL,
      updatedAt: new Date()
    });

    return downloadURL;
  } catch (error) {
    console.error('Error al subir foto de perfil:', error);
    throw error;
  }
};

//Función para guardar prácticas del modulo.

export const saveModulePractice: SaveResultsModulePractice = async (testId, score, answers, module_number) => {
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
      module_number,
    }

    //Guardar en FireStore
    const docRef = await addDoc(collection(db, 'users', user.uid, 'resultados'), result);
    return docRef.id;

  } catch (error) {
    console.error('Error al guardar resultado:', error)
    throw error;
  }
};