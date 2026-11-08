import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { UserStateProvider } from '@/shared/state/UserStateContext';
import MapScreen from './MapScreen';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

describe('MapScreen', () => {
  it('muestra las 15 islas y el pasaporte con el progreso actual', () => {
    const store = new UserStateStore(new StorageService(null, 0));

    render(
      <MemoryRouter future={routerFuture}>
        <UserStateProvider store={store}>
          <MapScreen />
        </UserStateProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Archipiélago' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(15);
    expect(screen.getByText('Isla Reloj')).toBeInTheDocument();
    expect(screen.getByText('Isla Mirador')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pasaporte 0/i })).toBeInTheDocument();
  });
});
