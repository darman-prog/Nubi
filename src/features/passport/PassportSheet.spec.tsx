import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { UserStateProvider } from '@/shared/state/UserStateContext';
import PassportSheet from './PassportSheet';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

describe('PassportSheet', () => {
  it('muestra «Aún no tienes sellos» cuando el usuario todavía no ha reclamado ninguno', () => {
    const store = new UserStateStore(new StorageService(null, 0));

    render(
      <MemoryRouter future={routerFuture}>
        <UserStateProvider store={store}>
          <PassportSheet />
        </UserStateProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/aún no tienes sellos/i)).toBeInTheDocument();
    expect(screen.queryByText(/aún no ganas sellos/i)).not.toBeInTheDocument();
  });
});
