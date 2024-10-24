// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALDlYGS9pg0ePbu-HS4CrRhPGx8fmGlFg",
  authDomain: "chamados-6213b.firebaseapp.com",
  projectId: "chamados-6213b",
  storageBucket: "chamados-6213b.appspot.com",
  messagingSenderId: "1023857403514",
  appId: "1:1023857403514:web:33bb20b92cb37999d0fdc3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

export { app, auth  };