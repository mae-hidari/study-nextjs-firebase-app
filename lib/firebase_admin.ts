import * as admin from "firebase-admin";
import { credential } from "firebase-admin";

if (admin.apps.length == 0) {
  const jsonCredential = JSON.parse(process.env.GCP_CREDENTIAL);

  admin.initializeApp({
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    credential: admin.credential.cert(jsonCredential),
  });
}
