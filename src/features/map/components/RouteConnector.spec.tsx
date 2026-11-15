import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouteConnector } from './RouteConnector';

describe('RouteConnector', () => {
  it('es decorativo para lectores de pantalla y expone su estado visual', () => {
    const { container, rerender } = render(<RouteConnector status="active" />);
    const root = container.firstElementChild;

    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-status', 'active');
    expect(container.querySelectorAll('svg')).toHaveLength(2);

    rerender(<RouteConnector status="upcoming" flip />);
    expect(root).toHaveAttribute('data-status', 'upcoming');
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('alterna la curvatura en S cuando flip está activo', () => {
    const { container: normal } = render(<RouteConnector status="completed" />);
    const { container: flipped } = render(<RouteConnector status="completed" flip />);

    const normalPath = normal.querySelector('path')?.getAttribute('d');
    const flippedPath = flipped.querySelector('path')?.getAttribute('d');

    expect(normalPath).toBeTruthy();
    expect(flippedPath).toBeTruthy();
    expect(normalPath).not.toBe(flippedPath);
  });
});
