import * as admin from 'firebase-admin';

// Check if the service account path is defined or if we are using environment variables
// Normally you want to not commit the JSON file but provide it via env string in Vercel
let serviceAccount;
try {
  // If the file exists locally, use it
  serviceAccount = require('../../bubbly-team-409214-firebase-adminsdk-fbsvc-090e19dbda.json');
} catch (error) {
  // Otherwise, fallback to env variable (for Vercel deployment)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  }
}

// Initialize the app only once
if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const adminDb = admin.firestore?.();
export const adminAuth = admin.auth?.();
export default admin;
