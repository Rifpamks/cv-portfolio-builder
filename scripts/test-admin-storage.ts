import * as admin from "firebase-admin";

const serviceAccount = require("../bubbly-team-409214-firebase-adminsdk-fbsvc-090e19dbda.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "bubbly-team-409214.appspot.com",
  });
}

async function testAdminUpload() {
  const bucket = admin.storage().bucket();
  const file = bucket.file("test/admin-test.txt");
  
  try {
    await file.save("Hello from admin sdk!", {
      contentType: "text/plain"
    });
    console.log("Admin upload successful!");
  } catch (error) {
    console.error("Admin upload failed:");
    console.error(error);
  }
}

testAdminUpload();
