const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/dashboard/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Remove unused Firestore imports if they exist
  content = content.replace(/import \{ doc, getDoc, updateDoc \} from "firebase\/firestore";\n/g, '');
  content = content.replace(/import \{ doc, getDoc \} from "firebase\/firestore";\n/g, '');
  content = content.replace(/import \{ doc \} from "firebase\/firestore";\n/g, '');
  content = content.replace(/import \{ db \} from "@\/lib\/firebase";\n/g, '');

  fs.writeFileSync(file, content, 'utf8');
});

console.log("Cleanup complete.");
