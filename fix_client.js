const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('d:\\Projects\\Anti Gravity\\Web\\Web 05\\components');

let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Check if it's already a client component
  if (content.includes("'use client'") || content.includes('"use client"')) {
    return;
  }
  
  // Check if it uses client-side hooks or libraries
  const usesHooks = content.match(/\b(useState|useEffect|useRef|useCallback|useMemo|useRouter|usePathname|useSearchParams)\b/);
  const usesFramerMotion = content.includes('framer-motion');
  const usesDOM = content.includes('document.') || content.includes('window.');
  
  if (usesHooks || usesFramerMotion || usesDOM) {
    fs.writeFileSync(file, "'use client';\n" + content);
    modifiedCount++;
    console.log('Fixed ' + file);
  }
});
console.log('Modified ' + modifiedCount + ' files.');
