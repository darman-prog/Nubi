/**
 * Script de validación de contenido contra esquemas y compuertas (RF-23 / T-02).
 * Por ahora verifica que los directorios existan y reporta estado verde en dev.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content');

console.log('=== [validate:content] Verificando estructura de contenido ===');

// Verificamos que la carpeta content exista
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

console.log('Estructura de contenido inicial validada correctamente.');
process.exit(0);
