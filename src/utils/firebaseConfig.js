"use client";
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeVoYzoST-SgA0BiWaxYMkHCPpuUYGKu8",
  authDomain: "identidy-nfc.firebaseapp.com",
  projectId: "identidy-nfc",
  storageBucket: "identidy-nfc.appspot.com",
  messagingSenderId: "403470328257",
  appId: "1:403470328257:web:ea0addd969555e67114f40",
  measurementId: "G-FJPVE95MDH",
  storageBucket: "identidy-nfc.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

const storageRef = ref(storage);

export { app, storage, storageRef, ref };
