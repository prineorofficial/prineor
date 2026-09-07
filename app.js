import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distServer = path.join(__dirname, 'dist', 'server.cjs');

// Auto-compile if dist/server.cjs is missing
if (!fs.existsSync(distServer)) {
  console.log('[Hostinger Boot] dist/server.cjs not found. Building on the fly...');
  try {
    const esbuild = await import('esbuild');
    await esbuild.build({
      entryPoints: [path.join(__dirname, 'server.ts')],
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
