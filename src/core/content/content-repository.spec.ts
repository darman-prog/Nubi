import { describe, expect, it } from 'vitest';
import { artUrl, hasArt } from './assets';
import { loadContent } from './content-loader';
import { content, createContentRepository } from './content-repository';

describe('ContentRepository', () => {
  it('carga y valida las islas del disco', () => {
    const data = loadContent();

    expect(data.islands.length).toBeGreaterThanOrEqual(5);
    expect(data.islands.every((island) => island.id.startsWith('ISL-'))).toBe(true);
    expect(data.evidence.length).toBeGreaterThan(0);
  });

  it('indexa islas por slug e id', () => {
    expect(content.islandBySlug('nido')?.id).toBe('ISL-NIDO');
    expect(content.islandById('ISL-RELOJ')?.slug).toBe('reloj');
    expect(content.islandBySlug('no-existe')).toBeUndefined();
  });

  it('filtra las islas disponibles y respeta el orden sugerido', () => {
    const disponibles = content.availableIslands();

    expect(disponibles.map((island) => island.id)).toEqual(['ISL-NIDO', 'ISL-RELOJ']);
    expect(content.islandBySlug('horarios')?.disponibilidad).toBe('coming_soon');
  });

  it('crea un repositorio a partir de datos ya validados', () => {
    const data = loadContent();
    const repo = createContentRepository(data);

    expect(repo.islands).toHaveLength(data.islands.length);
    expect(repo.chainById('C-01')?.title).toBe('Del reloj al ánimo');
    expect(repo.edgeById('B-01')?.status).toBe('published');
  });
});

describe('assets', () => {
  it('resuelve el arte existente a una URL de Vite', () => {
    expect(artUrl('arte/escenas/reloj-1.webp')).toContain('reloj-1');
    expect(hasArt('arte/islas/nido.webp')).toBe(true);
  });

  it('falla si el arte no existe', () => {
    expect(() => artUrl('arte/escenas/no-existe.webp')).toThrow('Arte no encontrado');
  });
});
