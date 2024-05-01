// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBy20quEMBowBaOpFTBlmjHrf-cEbY0NSk",
//   authDomain: "cs194-oovoo.firebaseapp.com",
//   projectId: "cs194-oovoo",
//   storageBucket: "cs194-oovoo.appspot.com",
//   messagingSenderId: "21023404171",
//   appId: "1:21023404171:web:dffb907f62ec4f5541a48e",
//   measurementId: "G-9ZXH53GEVP"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

