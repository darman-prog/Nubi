import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

function Harness({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir confirmación
      </button>
      <ConfirmDialog
        open={open}
        title="¿Confirmar acción?"
        message="Esto elimina todo lo guardado en este dispositivo. No se puede deshacer."
        confirmLabel="Sí, borrar"
        tone="danger"
        onConfirm={() => {
          onConfirm();
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

describe('ConfirmDialog', () => {
  it('cierra con Esc y devuelve el foco al botón que lo abrió', async () => {
    render(<Harness onConfirm={vi.fn()} />);

    const trigger = screen.getByRole('button', { name: 'Abrir confirmación' });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog', { name: '¿Confirmar acción?' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('ejecuta onConfirm al presionar el botón de confirmación', () => {
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir confirmación' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sí, borrar' }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
