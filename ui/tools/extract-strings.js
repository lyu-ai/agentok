const { glob } = require('glob');
const fs = require('fs');

async function extractStrings() {
  const regex = /<\w+(?:\s+[^<>"]+)*?>([\u4e00-\u9fff]+)<\/\w+>/g;
  const tsxFiles = await glob('src/**/*.tsx', {});
  console.log('Found', tsxFiles.length, 'tsx files');

  tsxFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = regex.exec(content)) !== null) {
      console.log(`Found string in ${file}: ${match[1]}`);
    }
    console.log('Completed extracting strings from', file);
  });
}

extractStrings().catch(console.error);
