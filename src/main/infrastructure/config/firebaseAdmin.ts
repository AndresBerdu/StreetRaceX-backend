import admin from "firebase-admin";
import * as fireorm from "fireorm";

let initialized = false;

export const initFirebase = () => {
  if (initialized) return;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
    databaseURL: "https://street-race-x.firebaseio.com",
  });

  const firestore = admin.firestore();
  fireorm.initialize(firestore);

  initialized = true;

  console.log("Firebase initialized");
};