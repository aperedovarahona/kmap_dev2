import { spawn, spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..', 'backend');
const isWin = process.platform === 'win32';

console.log('====================================================');
console.log('🚀 Iniciando Plan Kmap Fullstack (PHP CI3 + React)');
console.log('   Backend : http://localhost:4000 (PHP CodeIgniter 3)');
console.log('   Frontend: http://localhost:5173 (React + Vite)');
console.log('====================================================');

// Detección automática del ejecutable PHP (compatible con XAMPP en Windows y PATH general)
function resolvePhpBin() {
  if (process.env.PHP_BIN && fs.existsSync(process.env.PHP_BIN)) {
    return process.env.PHP_BIN;
  }
  const candidates = [
    'C:\\xampp\\php\\php.exe',
    'D:\\xampp\\php\\php.exe',
    'E:\\xampp\\php\\php.exe',
    'C:\\php\\php.exe',
    'C:\\Program Files\\PHP\\php.exe',
  ];
  if (isWin) {
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        return c;
      }
    }
  }
  return 'php';
}

const phpBin = resolvePhpBin();

// 1. Iniciar servidor backend PHP CodeIgniter 3 en puerto 4000
const phpServer = spawn(phpBin, ['-S', '0.0.0.0:4000', 'router.php'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: false,
});

phpServer.on('error', (err) => {
  console.error('❌ Error al iniciar el servidor PHP:', err.message);
  console.error('Verifica que PHP esté instalado y agregado a tu variable PATH o en C:\\xampp\\php\\php.exe');
});

// 2. Iniciar servidor frontend Vite mediante importación absoluta y comprobación de dependencias
const viteDistPath = path.resolve(__dirname, 'node_modules', 'vite', 'dist', 'node', 'index.js');

if (!fs.existsSync(viteDistPath)) {
  console.log('📦 No se encontraron dependencias en front/node_modules. Instalando automáticamente...');
  const npmCmd = isWin ? 'npm.cmd' : 'npm';
  const installResult = spawnSync(npmCmd, ['install'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: isWin,
  });
  if (installResult.status !== 0 || !fs.existsSync(viteDistPath)) {
    console.error('❌ Error instalando paquetes de front/. Ejecuta "npm --prefix front install" manualmente.');
    process.exit(1);
  }
}

let viteServer = null;

try {
  const viteUrl = pathToFileURL(viteDistPath).href;
  const { createServer } = await import(viteUrl);

  viteServer = await createServer({
    root: __dirname,
    configFile: path.resolve(__dirname, 'vite.config.js'),
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
  });

  await viteServer.listen();
  viteServer.printUrls();
  if (typeof viteServer.bindCLIShortcuts === 'function') {
    viteServer.bindCLIShortcuts({ print: true });
  }
} catch (err) {
  console.error('❌ Error al iniciar Vite:', err.message);
}

// Limpieza de procesos al salir
async function cleanup() {
  try {
    if (phpServer && !phpServer.killed) {
      phpServer.kill();
    }
  } catch {}
  try {
    if (viteServer) {
      await viteServer.close();
    }
  } catch {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
