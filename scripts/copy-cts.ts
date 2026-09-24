import fs from 'node:fs';

const filesToCopy = [
  'dist/index.d.ts',
  'dist/constants/index.d.ts',
  'dist/fixtures/index.d.ts',
  'dist/matchers/index.d.ts',
];

for (const file of filesToCopy) {
  const ctsFile = file.replace(/\.d\.ts$/, '.d.cts');
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, ctsFile);
  } else {
    console.error(`[Error] File not found for CTS copy: ${file}`);
    process.exit(1);
  }
}
