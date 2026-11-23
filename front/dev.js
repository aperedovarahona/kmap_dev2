import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..', 'backend');

console.log('====================================================');
console.log('🚀 Iniciando Plan Kmap Fullstack (PHP CI3 + React)');
console.log('   Backend : http://localhost:4000 (PHP CodeIgniter 3)');
console.log('   Frontend: http://localhost:5173 (React + Vite)');
console.log('====================================================');

// 1. Iniciar servidor backend PHP CodeIgniter 3 en puerto 4000
const phpServer = spawn('php', ['-S', '0.0.0.0:4000', 'router.php'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: false,
});

phpServer.on('error', (err) => {
  console.error('❌ Error al iniciar el servidor PHP:', err.message);
  console.error('Verifica que PHP esté instalado y agregado a tu variable PATH.');
});

// 2. Iniciar servidor de desarrollo de Vite
const viteBin = path.resolve(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const viteServer = spawn(process.execPath, [viteBin], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: false,
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
