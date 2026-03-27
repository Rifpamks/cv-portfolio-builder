const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/{app/dashboard,context}/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if already processed or irrelevant
  if (!content.includes('getDoc') && !content.includes('updateDoc') && !content.includes('setDoc')) return;

  // Add import for adminProxy
  if (!content.includes('@/lib/adminProxy')) {
    content = content.replace(/(import .* from "firebase\/firestore";)/, `$1\nimport { adminGetDoc, adminUpdateDoc, adminSetDoc } from "@/lib/adminProxy";`);
  }

  // Replace getDoc
  content = content.replace(/getDoc\(doc\([^,]+,\s*"users",\s*(user\.uid|firebaseUser\.uid)\)\)/g, 'adminGetDoc("users", $1)');
  
  // Replace updateDoc
  content = content.replace(/updateDoc\(doc\([^,]+,\s*"users",\s*(user\.uid|firebaseUser\.uid)\)/g, 'adminUpdateDoc("users", $1');

  // Replace setDoc
  content = content.replace(/setDoc\(doc\([^,]+,\s*"users",\s*(user\.uid|firebaseUser\.uid)\)/g, 'adminSetDoc("users", $1');

  // Special case for portfolio saving publicProfiles
  content = content.replace(/updateDoc\(doc\([^,]+,\s*"publicProfiles",\s*(user\.uid|firebaseUser\.uid)\)/g, 'adminSetDoc("publicProfiles", $1');

  fs.writeFileSync(file, content, 'utf8');
});

console.log("Replacements complete.");
