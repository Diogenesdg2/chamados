// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzv8_jgbN6fe9RC2vR6L8Y3UKU9-hQfQw",
  authDomain: "chamados-eebd0.firebaseapp.com",
  projectId: "chamados-eebd0",
  storageBucket: "chamados-eebd0.appspot.com",
  messagingSenderId: "897329428905",
  appId: "1:897329428905:web:c9f1ba62b623e5b2c96cb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
 

export { app, db };