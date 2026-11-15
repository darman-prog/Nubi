import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('es decorativo por defecto cuando no recibe label', () => {
    const { container } = render(<Icon name="cloud" size={18} />);
    const svg = container.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveAttribute('width', '18');
    expect(svg).toHaveAttribute('height', '18');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('expone rol img y aria-label cuando recibe label', () => {
    render(<Icon name="medal" label="Sello ganado" />);
    const img = screen.getByRole('img', { name: 'Sello ganado' });

    expect(img).toBeInTheDocument();
    expect(img).not.toHaveAttribute('aria-hidden');
  });
});
