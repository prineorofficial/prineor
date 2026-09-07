import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverTs = path.join(__dirname, 'server.ts');
const distServer = path.join(__dirname, 'dist', 'server.cjs');

// Auto-compile if dist/server.cjs is missing or server.ts is newer
let shouldBuild = !fs.existsSync(distServer);
if (!shouldBuild && fs.existsSync(serverTs)) {
  try {
    const tsTime = fs.statSync(serverTs).mtimeMs;
    const cjsTime = fs.statSync(distServer).mtimeMs;
    if (tsTime > cjsTime) {
      shouldBuild = true;
    }
  } catch (e) {
    // ignore stat error
  }
}

if (shouldBuild) {
  console.log('[Hostinger Boot] Compiling server.ts to dist/server.cjs...');
  try {
    const esbuild = await import('esbuild');
    await esbuild.build({
      entryPoints: [serverTs],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      packages: 'external',
      sourcemap: true,
      outfile: distServer,
    });
    console.log('[Hostinger Boot] Successfully generated dist/server.cjs');
  } catch (err) {
    console.error('[Hostinger Boot] Error compiling server.ts:', err);
  }
}

if (fs.existsSync(distServer)) {
  await import('./dist/server.cjs');
} else {
  console.error('[Hostinger Boot] Critical: dist/server.cjs could not be loaded.');
  process.exit(1);
}
