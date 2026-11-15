import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';

describe('Toast', () => {
  it('mantiene una región polite montada y anuncia el mensaje cuando llega', () => {
    const { rerender } = render(<Toast message={null} />);
    const region = screen.getByRole('status');

    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toBeEmptyDOMElement();

    rerender(<Toast message="Diario guardado" />);
    expect(region).toHaveTextContent('Diario guardado');
  });

  it('permite cerrar el aviso manualmente o por temporizador', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast message="Viaje restaurado" durationMs={1500} onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar aviso' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1500);
    expect(onDismiss).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
