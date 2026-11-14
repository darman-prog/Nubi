import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { createInitialState } from '@/core/user-state';
import { UserStateProvider } from '@/shared/state/UserStateContext';
import DiaryScreen from './DiaryScreen';

describe('DiaryScreen', () => {
  it('guarda una entrada del diario calculando duración', () => {
    const store = new UserStateStore(new StorageService(null, 0));
    render(
      <UserStateProvider store={store}>
        <DiaryScreen />
      </UserStateProvider>,
    );

    expect(screen.queryByText(/¿probaste tu reto o experimento\?/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(store.getState().diary).toHaveLength(1);
    expect(screen.getByText(/guardado\. gracias por mirar tu descanso/i)).toBeInTheDocument();
  });

  it('muestra y guarda seguimiento del reto cuando hay un reto o sello activo', () => {
    const state = createInitialState();
    state.challenges.push({ islandId: 'ISL-RELOJ', acceptedAt: '2026-11-14' });
    const store = new UserStateStore(new StorageService(null, 0), state);

    render(
      <UserStateProvider store={store}>
        <DiaryScreen />
      </UserStateProvider>,
    );

    expect(screen.getByText(/¿probaste tu reto o experimento\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Más o menos' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(store.getState().diary[0]?.experimentTried).toBe('some');
  });
});
