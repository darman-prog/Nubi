// Vite emite cada WebP como asset y devuelve su URL final.
const artModules = import.meta.glob('../../../arte/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const ART_PREFIX = '../../../arte/';

/** Convierte la ruta de contenido ('arte/escenas/reloj-1.webp') en URL de Vite. */
export const artUrl = (path: string): string => {
  const key = `${ART_PREFIX}${path.replace(/^arte\//, '')}`;
  const url = artModules[key];
  if (!url) throw new Error(`Arte no encontrado: ${path}`);
  return url;
};

export const hasArt = (path: string): boolean => {
  const key = `${ART_PREFIX}${path.replace(/^arte\//, '')}`;
  return key in artModules;
};
