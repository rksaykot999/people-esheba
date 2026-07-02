const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/color:\s*['"]#fff['"]/g, (match, offset, string) => {
        const surrounding = string.substring(Math.max(0, offset - 100), offset + 50);
        if (surrounding.includes('background') && (surrounding.includes('var(--primary)') || surrounding.includes('var(--grad-cyan)'))) {
           return match;
        }
        if (surrounding.includes('?')) {
           return match;
        }
        return `color:'var(--text-strong)'`;
      });
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir('./src/pages/admin');
replaceInDir('./src/components/layout');
console.log('Replaced hardcoded #fff with var(--text-strong)');
