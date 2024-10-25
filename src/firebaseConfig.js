// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDelp-W-zGnoI-37cIe41vlCXgxS7JM78k",
  authDomain: "chamadosviman.firebaseapp.com",
  projectId: "chamadosviman",
  storageBucket: "chamadosviman.appspot.com",
  messagingSenderId: "103714608447",
  appId: "1:103714608447:web:a5823924d71c2722f16f8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
 

export { app, db };