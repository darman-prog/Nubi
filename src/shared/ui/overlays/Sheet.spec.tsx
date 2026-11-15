import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sheet } from './Sheet';

describe('Sheet', () => {
  it('abre un diálogo modal, atrapa el foco y cierra con Esc', () => {
    const onClose = vi.fn();
    render(
      <Sheet title="Prueba" onClose={onClose}>
        <button type="button">Acción</button>
      </Sheet>,
    );

    expect(screen.getByRole('dialog', { name: 'Prueba' })).toHaveFocus();

    const close = screen.getByRole('button', { name: 'Cerrar' });
    const action = screen.getByRole('button', { name: 'Acción' });
    action.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('devuelve el foco al disparador al cerrar', async () => {
    function Harness(): React.JSX.Element {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Abrir
          </button>
          {open ? (
            <Sheet title="Prueba" onClose={() => setOpen(false)}>
              <p>Contenido</p>
            </Sheet>
          ) : null}
        </>
      );
    }

    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));

    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
