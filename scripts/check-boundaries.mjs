#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

// Presupuesto de deuda de ADR-015: capas, límites de tamaño, contextos y ciclos.
const ROOT = process.cwd();
const RUNTIME_DEPS = new Set(['react', 'react-dom', 'react-router-dom', 'zod']);
const CONTEXT_LIMIT = 1;
const DOM_GLOBALS = /\b(window|document|localStorage|sessionStorage|navigator)\b/g;
const FEATURE_STORAGE = /\b(localStorage|sessionStorage)\b/g;

const toPosix = (value) => value.split(path.sep).join('/');
const lineOf = (source, index) => source.slice(0, index).split('\n').length;

// Enmascara comentarios con espacios para conservar los índices y las líneas.
const maskComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/.*$/gm, (match, prefix) => prefix + ' '.repeat(match.length - prefix.length));

const IMPORT_RE = /(?:from\s+|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]/g;
const SIDE_EFFECT_RE = /(?:^|\n)\s*import\s+['"]([^'"]+)['"]/g;

/** Recorre src/ y devuelve solo TypeScript/TSX de producción. */
function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    if (/\.spec\./.test(entry.name) || entry.name.endsWith('.d.ts')) return [];
    return [full];
  });
}

/** Identifica la capa por la ruta relativa (POSIX) del archivo. */
function layerOf(file) {
  if (file.startsWith('src/features/')) {
    return { layer: 'feature', name: file.split('/')[2] };
  }
  if (file.startsWith('src/domain/')) return { layer: 'domain' };
  if (file.startsWith('src/core/')) return { layer: 'core' };
  if (file.startsWith('src/shared/ui/')) return { layer: 'ui' };
  if (file.startsWith('src/shared/')) return { layer: 'shared' };
  if (file.startsWith('src/app/')) return { layer: 'app' };
  if (file.startsWith('src/')) return { layer: 'root' };
  return { layer: 'other' };
}

/** Convierte un import interno en ruta POSIX; null si es un paquete externo. */
function internalPath(spec, file) {
  if (spec.startsWith('@/')) return `src/${spec.slice(2)}`;
  if (spec.startsWith('.')) {
    return toPosix(path.posix.normalize(path.posix.join(path.posix.dirname(file), spec)));
  }
  return null;
}

const isUnder = (value, prefix) => value === prefix || value.startsWith(`${prefix}/`);

/** Extrae imports con su índice para poder reportar la línea. */
function parseImports(source) {
  const found = [];
  for (const regex of [IMPORT_RE, SIDE_EFFECT_RE]) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(source)) !== null) {
      found.push({ spec: match[1], index: match.index });
    }
  }
  return found;
}

function limitFor(file) {
  if (file.startsWith('src/features/')) {
    const base = path.posix.basename(file);
    if (/(Screen|Sheet)\.tsx$/.test(base)) return 180;
    return 220;
  }
  if (file.startsWith('src/domain/')) return 150;
  if (file.startsWith('src/core/')) return 200;
  if (file.startsWith('src/shared/')) return 200;
  if (file.startsWith('src/app/')) return 200;
  if (file.startsWith('src/')) return 200;
  return null;
}

/** Valida un archivo contra las reglas de capas, imports, globals y tamaño. */
function checkSource(file, source) {
  const errors = [];
  const code = maskComments(source);
  const { layer, name } = layerOf(file);
  const add = (index, rule, message) =>
    errors.push({ file, line: lineOf(source, index), rule, message });

  for (const { spec, index } of parseImports(code)) {
    const target = internalPath(spec, file);
    const external = target === null;

    if (layer === 'domain') {
      if (external && ['react', 'react-dom', 'react-router-dom'].includes(spec)) {
        add(index, 'domain-purity', `domain no puede importar ${spec}`);
      }
      if (target && ['src/core', 'src/features', 'src/app', 'src/shared'].some((p) => isUnder(target, p))) {
        add(index, 'domain-purity', `domain no puede importar ${target}`);
      }
    }

    if (layer === 'core') {
      if (external && ['react', 'react-dom', 'react-router-dom'].includes(spec)) {
        add(index, 'core-no-react', `core no puede importar ${spec}`);
      }
      if (target && ['src/features', 'src/app', 'src/shared'].some((p) => isUnder(target, p))) {
        add(index, 'core-no-react', `core no puede importar ${target}`);
      }
    }

    if (layer === 'ui') {
      const denied = ['src/core', 'src/domain', 'src/features', 'src/app', 'src/shared/state'];
      if (target && denied.some((p) => isUnder(target, p))) {
        add(index, 'ui-purity', `shared/ui no puede importar ${target}`);
      }
    }

    if (layer === 'feature') {
      if (target && isUnder(target, 'src/app')) {
        add(index, 'feature-to-app', `una feature no puede importar ${target}`);
      }
      if (target && isUnder(target, 'src/features')) {
        const other = target.split('/')[2];
        if (other && other !== name) {
          add(index, 'feature-to-feature', `la feature ${name} no puede importar ${other}`);
        }
      }
      // El contenido debe llegar por ContentRepository, no por import directo.
      if (target && /(^|\/)content\//.test(target) && spec.endsWith('.json')) {
        add(index, 'feature-content', 'las features no importan JSON de content/');
      }
    }

    if (layer === 'shared' && target && ['src/app', 'src/features'].some((p) => isUnder(target, p))) {
      add(index, 'shared-purity', `shared no puede importar ${target}`);
    }
  }

  // Los globals se revisan sin comentarios; las cadenas no se analizan para no complicar el script.
  if (layer === 'domain') {
    for (const match of code.matchAll(DOM_GLOBALS)) {
      add(match.index, 'domain-globals', `domain no puede usar ${match[0]}`);
    }
  }
  if (layer === 'feature') {
    for (const match of code.matchAll(FEATURE_STORAGE)) {
      add(match.index, 'feature-storage', 'el progreso se lee vía UserStateStore, no directo');
    }
  }

  const limit = limitFor(file);
  if (limit) {
    const lines = source.replace(/\n$/, '').split('\n').length;
    if (lines > limit) {
      errors.push({
        file,
        line: limit + 1,
        rule: 'line-budget',
        message: `${lines} líneas; el límite es ${limit}`,
      });
    } else if (lines > limit * 0.9) {
      console.warn(`aviso: ${file} tiene ${lines} líneas (límite ${limit})`);
    }
  }

  return errors;
}

/** Como máximo un createContext en todo src/. */
function checkContexts(files) {
  const contexts = files.filter((file) =>
    /\bcreateContext\s*\(/.test(maskComments(readFileSync(file, 'utf8'))),
  );
  if (contexts.length <= CONTEXT_LIMIT) return [];
  return [
    {
      file: toPosix(path.relative(ROOT, contexts[0])),
      line: 1,
      rule: 'contexts',
      message: `hay ${contexts.length} createContext; el límite es ${CONTEXT_LIMIT}`,
    },
  ];
}

/** Solo las cuatro dependencias runtime del ADR-015. */
function checkDeps(pkg) {
  return Object.keys(pkg.dependencies ?? {})
    .filter((dep) => !RUNTIME_DEPS.has(dep))
    .map((dep) => ({
      file: 'package.json',
      line: 1,
      rule: 'runtime-deps',
      message: `dependencia runtime no permitida: ${dep}`,
    }));
}

function resolveToFile(target, fileSet) {
  const candidates = [target, `${target}.ts`, `${target}.tsx`, `${target}/index.ts`, `${target}/index.tsx`];
  return candidates.find((candidate) => fileSet.has(candidate)) ?? null;
}

/** Detecta ciclos con DFS de tres colores sobre el grafo interno. */
function checkCycles(files) {
  const relative = files.map((file) => toPosix(path.relative(ROOT, file)));
  const fileSet = new Set(relative);
  const graph = new Map();

  for (const file of relative) {
    const source = readFileSync(path.join(ROOT, file), 'utf8');
    const deps = parseImports(maskComments(source))
      .map(({ spec }) => internalPath(spec, file))
      .filter(Boolean)
      .map((target) => resolveToFile(target, fileSet))
      .filter(Boolean);
    graph.set(file, deps);
  }

  const visiting = new Set();
  const visited = new Set();
  const stack = [];

  const visit = (node) => {
    if (visiting.has(node)) {
      const start = stack.indexOf(node);
      return [...stack.slice(start), node];
    }
    if (visited.has(node)) return null;
    visiting.add(node);
    stack.push(node);
    for (const dep of graph.get(node) ?? []) {
      const cycle = visit(dep);
      if (cycle) return cycle;
    }
    stack.pop();
    visiting.delete(node);
    visited.add(node);
    return null;
  };

  for (const node of graph.keys()) {
    const cycle = visit(node);
    if (cycle) {
      return [
        {
          file: cycle[0],
          line: 1,
          rule: 'cycles',
          message: `ciclo de imports: ${cycle.join(' -> ')}`,
        },
      ];
    }
  }
  return [];
}

function runSelfTest() {
  const cases = [
    ['feature-to-feature', 'src/features/map/MapScreen.tsx', "import { X } from '@/features/island/IslandSheet';"],
    ['domain-purity', 'src/domain/graph/validate.ts', "import React from 'react';"],
    ['ui-purity', 'src/shared/ui/Button.tsx', "import { Isla } from '@/domain/isla';"],
    ['feature-storage', 'src/features/map/MapScreen.tsx', "const x = localStorage.getItem('a');"],
    ['core-no-react', 'src/core/storage.ts', "import { MapScreen } from '@/features/map/MapScreen';"],
    [null, 'src/features/map/MapScreen.tsx', "import { Button } from '@/shared/ui/Button'; import { validateChain } from '@/domain/graph/validate';"],
    ['line-budget', 'src/domain/graph/long.ts', 'x\n'.repeat(151)],
  ];

  let ok = true;
  for (const [expected, file, source] of cases) {
    const errors = checkSource(file, source);
    const found = errors.map((error) => error.rule);
    if (expected === null) {
      if (found.length > 0) {
        ok = false;
        console.error(`self-test falló: caso válido con ${found.join(', ')}`);
      }
    } else if (!found.includes(expected)) {
      ok = false;
      console.error(`self-test falló: ${file} no disparó ${expected} (vio: ${found.join(', ') || 'nada'})`);
    }
  }

  const depErrors = checkDeps({ dependencies: { lodash: '1.0.0' } });
  if (!depErrors.some((error) => error.rule === 'runtime-deps')) {
    ok = false;
    console.error('self-test falló: runtime-deps no detectó lodash');
  }

  if (ok) console.log('check:boundaries self-test OK (8 casos)');
  return ok;
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) {
  process.exit(runSelfTest() ? 0 : 1);
}

const files = walk(path.join(ROOT, 'src'));
const errors = [];

for (const file of files) {
  const relative = toPosix(path.relative(ROOT, file));
  errors.push(...checkSource(relative, readFileSync(file, 'utf8')));
}

errors.push(...checkContexts(files));
errors.push(...checkDeps(JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'))));
errors.push(...checkCycles(files));

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`${error.file}:${error.line} [${error.rule}] ${error.message}`);
  }
  process.exit(1);
}

console.log(`check:boundaries OK (${files.length} archivos)`);
