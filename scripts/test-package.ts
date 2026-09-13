import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const tempDir = path.resolve(rootDir, '.pack-test');
const testFilePath = path.resolve(rootDir, 'tests/integration/exports.spec.ts');

try {
  console.log('🏗️ Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('📦 Packing tarball...');
  const packOutput = execSync('npm pack --json', { encoding: 'utf-8' });
  const tarballName = JSON.parse(packOutput)[0].filename;
  const tarballPath = path.resolve(rootDir, tarballName);

  if (existsSync(tempDir)) rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir);

  writeFileSync(
    path.join(tempDir, 'package.json'),
    JSON.stringify({
      name: 'pack-test',
      type: 'module',
      private: true,
    }),
  );

  console.log('📥 Installing tarball into temporary node_modules...');
  execSync(`npm install "${tarballPath}"`, { cwd: tempDir, stdio: 'inherit' });

  console.log('🧪 Running Vitest against node_modules...');
  execSync(`npx vitest run "${testFilePath}" --root "${rootDir}"`, {
    cwd: tempDir,
    stdio: 'inherit',
  });

  console.log('✅ Package subpaths successfully verified from node_modules!');
} catch {
  console.error('❌ Package verification failed!');
  process.exit(1);
} finally {
  if (existsSync(tempDir)) rmSync(tempDir, { recursive: true, force: true });

  const files = readdirSync(rootDir);
  files.forEach((file) => {
    if (file.startsWith('playwright-clipboard-testing-') && file.endsWith('.tgz')) {
      rmSync(path.join(rootDir, file), { force: true });
    }
  });
}
