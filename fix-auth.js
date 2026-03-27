const fs = require('fs');
const path = 'src/context/AuthContext.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the problematic block
const target = /try \{\s*const userRef = doc\(db, "users", firebaseUser\.uid\);\s*const userSnap = await getDoc\(userRef\);\s*if \(!userSnap\.exists\(\)\) \{\s*await setDoc\(userRef, \{[\s\S]*?\}\);\s*\}\s*\} catch \(error\) \{/;
const replacement = `try {
          const userSnap = await adminGetDoc("users", firebaseUser.uid);
          if (!userSnap.exists()) {
            await adminSetDoc("users", firebaseUser.uid, {
              displayName: firebaseUser.displayName || "",
              email: firebaseUser.email || "",
              photoURL: firebaseUser.photoURL || "",
              createdAt: serverTimestamp(),
              pin: null,
              pinSet: false,
            });
          }
        } catch (error) {`;

content = content.replace(target, replacement);

// Clean up imports
content = content.replace(/import \{ doc, getDoc, setDoc, serverTimestamp \} from "firebase\/firestore";/, 'import { serverTimestamp } from "firebase/firestore";');

fs.writeFileSync(path, content, 'utf8');
console.log("AuthContext.tsx fixed.");
