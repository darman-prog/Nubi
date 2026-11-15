import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EvidenceBadge } from './EvidenceBadge';

describe('EvidenceBadge', () => {
  it('expone la etiqueta visible y el detalle completo para lectores de pantalla', () => {
    render(<EvidenceBadge level="E2" />);

    expect(screen.getByText('Probable')).toBeInTheDocument();
    expect(screen.getByText(/estudios con adolescentes, aún limitados/i)).toBeInTheDocument();
  });

  it('muestra la sigla corta en modo compacto sin perder la lectura completa', () => {
    render(<EvidenceBadge level="E3" compact />);

    const shortCode = screen.getByText('E3');
    expect(shortCode).toHaveAttribute('aria-hidden', 'true');
    expect(
      screen.getByText(/bien establecido: evidencia sólida con estudios consistentes/i),
    ).toBeInTheDocument();
  });
});
