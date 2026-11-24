import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..', 'backend');
const isWin = process.platform === 'win32';

// Inyectar node_modules/.bin al inicio del PATH del entorno
const binDir = path.resolve(__dirname, 'node_modules', '.bin');
const pathKey = Object.keys(process.env).find((k) => k.toLowerCase() === 'path') || 'PATH';
const currentPath = process.env[pathKey] || '';
const customEnv = {
  ...process.env,
  [pathKey]: `${binDir}${path.delimiter}${currentPath}`,
};

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
  env: customEnv,
});

phpServer.on('error', (err) => {
  console.error('❌ Error al iniciar el servidor PHP:', err.message);
  console.error('Verifica que PHP esté instalado y agregado a tu variable PATH o en C:\\xampp\\php\\php.exe');
});

// 2. Iniciar servidor de desarrollo de Vite directamente desde node_modules/.bin
const viteExecutable = path.resolve(__dirname, 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');
const viteCmd = fs.existsSync(viteExecutable) ? viteExecutable : (isWin ? 'npx.cmd' : 'npx');
const viteArgs = fs.existsSync(viteExecutable) ? [] : ['vite'];

const viteServer = spawn(viteCmd, viteArgs, {
  cwd: __dirname,
  stdio: 'inherit',
  shell: isWin,
  env: customEnv,
});

viteServer.on('error', (err) => {
  console.error('❌ Error al iniciar Vite:', err.message);
});

// Limpieza de procesos al salir
function cleanup() {
  try {
    if (phpServer && !phpServer.killed) {
      phpServer.kill();
    }
  } catch {}
  try {
    if (viteServer && !viteServer.killed) {
      viteServer.kill();
    }
  } catch {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
