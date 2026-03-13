import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuLOBPBPrLCN-hZKFd5XHRRHIAffQZ3LI",
  authDomain: "street-race-x.firebaseapp.com",
  projectId: "street-race-x",
  storageBucket: "street-race-x.firebasestorage.app",
  messagingSenderId: "298438818992",
  appId: "1:298438818992:web:30ebf2934326ea0ae6cf75",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
