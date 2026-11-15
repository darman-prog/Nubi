import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { content } from '@/core/content/content-repository';
import { SealStage } from './SealStage';

describe('SealStage', () => {
  it('muestra la píldora «Fase 4 · Sello» sin usar «Conquista»', () => {
    const reloj = content.islandBySlug('reloj')!;

    render(
      <SealStage
        island={reloj}
        claimed={false}
        onClaim={vi.fn()}
        onMap={vi.fn()}
        onPassport={vi.fn()}
      />,
    );

    expect(screen.getByText('Fase 4 · Sello')).toBeInTheDocument();
    expect(screen.queryByText(/conquista/i)).not.toBeInTheDocument();
  });
});
