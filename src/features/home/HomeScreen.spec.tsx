import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { createInitialState } from '@/core/user-state';
import { UserStateProvider } from '@/shared/state/UserStateContext';
import HomeScreen from './HomeScreen';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

const renderHome = (store: UserStateStore) =>
  render(
    <MemoryRouter future={routerFuture}>
      <UserStateProvider store={store}>
        <HomeScreen />
      </UserStateProvider>
    </MemoryRouter>,
  );

describe('HomeScreen', () => {
  it('muestra la portada sin progreso', () => {
    renderHome(new UserStateStore(new StorageService(null, 0)));

    expect(screen.getByRole('heading', { name: 'Nubi' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /comenzar viaje/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /seguir donde quedaste/i })).not.toBeInTheDocument();
    expect(screen.getByText(/sin cuentas ni contraseñas/i)).toBeInTheDocument();
  });

  it('muestra seguir donde quedaste con el progreso real', () => {
    const state = createInitialState();
    state.progress.islands['ISL-NIDO'] = {
      stages: { llegada: true, historia: true, retos: true, sello: true },
      sourcesOpened: [],
      mechanicsDone: [],
    };
    const store = new UserStateStore(new StorageService(null, 0), state);

    renderHome(store);

    expect(
      screen.getByRole('button', { name: /seguir donde quedaste: 1 de 2 islas exploradas/i }),
    ).toBeInTheDocument();
  });
});
