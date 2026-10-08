import fs from 'fs'; 
let allPass = true;
['A', 'B', 'C', 'D'].forEach(p => { 
  const bounds = JSON.parse(fs.readFileSync(`art/source/fonts/typography_proof_${p}_bounds.json`, 'utf8')); 
  bounds.forEach(b => { 
    if (!b.pass) {
      console.error(`FAIL [Page ${p}]: ${b.role} '${b.text}' at x=${b.x}, right=${b.x+b.width}`); 
      allPass = false;
    } else {
      console.log(`PASS [Page ${p}]: ${b.role} '${b.text}' width=${b.width}`); 
    }
  }); 
});
if (!allPass) process.exit(1);
