import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Using bucket:", firebaseConfig.storageBucket);

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

async function testUpload() {
  try {
    console.log("Signing in...");
    // We can't actually sign in because we don't have user credentials here.
    // Let's just try to access the storage reference and see if it fails due to auth or configuration.
    const storageRef = ref(storage, "test/test.txt");
    console.log("Uploading file...");
    await uploadString(storageRef, "Hello World!");
    console.log("Upload successful!");
  } catch (error) {
    console.error("Upload failed with error:");
    if (error.code) console.error("Code:", error.code);
    if (error.message) console.error("Message:", error.message);
    if (error.serverResponse) console.error("Server Response:", error.serverResponse);
    console.error(error);
  }
}

testUpload();
