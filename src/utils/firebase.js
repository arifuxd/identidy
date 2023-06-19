// utils/firebase.js

import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeVoYzoST-SgA0BiWaxYMkHCPpuUYGKu8",
  authDomain: "identidy-nfc.firebaseapp.com",
  projectId: "identidy-nfc",
  storageBucket: "identidy-nfc.appspot.com",
  messagingSenderId: "403470328257",
  appId: "1:403470328257:web:1cdc9bb15bba7f93114f40",
  measurementId: "G-20RGD3HBQ2",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();

export { storage };
