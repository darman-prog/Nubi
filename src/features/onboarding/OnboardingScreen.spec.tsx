import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { UserStateProvider } from '@/shared/state/UserStateContext';
import OnboardingScreen from './OnboardingScreen';

// Evita CloudTransition.go en jsdom donde Element.getAnimations no existe.
vi.mock('@/shared/hooks/useTransitionNavigate', () => ({
  useTransitionNavigate: () => {
    const navigate = useNavigate();
    return (to: string) => navigate(to);
  },
}));

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

const renderOnboarding = (store: UserStateStore) =>
  render(
    <MemoryRouter initialEntries={['/bienvenida']} future={routerFuture}>
      <UserStateProvider store={store}>
        <Routes>
          <Route path="/bienvenida" element={<OnboardingScreen />} />
          <Route path="/mapa" element={<div>Mapa destino</div>} />
        </Routes>
      </UserStateProvider>
    </MemoryRouter>,
  );

describe('OnboardingScreen', () => {
  it('permite recorrer los 3 pasos, guardar apodo opcional y terminar en el mapa', () => {
    const store = new UserStateStore(new StorageService(null, 0));
    renderOnboarding(store);

    expect(screen.getByRole('heading', { name: /¡hola! soy nubi/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    const input = screen.getByPlaceholderText(/ej\. sofi/i);
    fireEvent.change(input, { target: { value: '  Camila  ' } });
    fireEvent.click(screen.getByRole('button', { name: /ir al archipiélago/i }));

    expect(store.getState().progress.onboardingDone).toBe(true);
    expect(store.getState().profile.nickname).toBe('Camila');
    expect(screen.getByText('Mapa destino')).toBeInTheDocument();
  });

  it('permite saltar desde el primer paso sin pedir apodo', () => {
    const store = new UserStateStore(new StorageService(null, 0));
    renderOnboarding(store);

    fireEvent.click(screen.getByRole('button', { name: 'Saltar' }));

    expect(store.getState().progress.onboardingDone).toBe(true);
    expect(store.getState().profile.nickname).toBeUndefined();
    expect(screen.getByText('Mapa destino')).toBeInTheDocument();
  });
});
