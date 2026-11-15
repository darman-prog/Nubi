import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { UserStateProvider } from '@/shared/state/UserStateContext';
import HelpScreen from './HelpScreen';

const renderHelp = (store: UserStateStore) =>
  render(
    <UserStateProvider store={store}>
      <HelpScreen />
    </UserStateProvider>,
  );

describe('HelpScreen', () => {
  it('actualiza tema y tamaño de texto desde Ajustes', () => {
    const store = new UserStateStore(new StorageService(null, 0));
    renderHelp(store);

    fireEvent.click(screen.getByRole('button', { name: 'Oscuro' }));
    fireEvent.click(screen.getByRole('button', { name: '125 %' }));

    expect(store.getState().settings.theme).toBe('dark');
    expect(store.getState().settings.textScale).toBe(1.25);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.textScale).toBe('1.25');
  });

  it('exige doble confirmación para borrar el viaje y volver a empezar', () => {
    const store = new UserStateStore(new StorageService(null, 0));
    renderHelp(store);

    expect(screen.queryByRole('button', { name: /exportar mi viaje/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /importar viaje/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Borrar mi viaje' }));
    expect(screen.getByRole('button', { name: /¿seguro\? toca para borrar todo/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /¿seguro\? toca para borrar todo/i }));
    expect(screen.getByText(/tu viaje ha sido reiniciado/i)).toBeInTheDocument();
  });

  it('muestra botón de instalación cuando llega beforeinstallprompt y refleja estado offline', async () => {
    const store = new UserStateStore(new StorageService(null, 0));
    renderHelp(store);

    const promptSpy = vi.fn(async () => {});
    const installEvent = new Event('beforeinstallprompt') as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    };
    installEvent.prompt = promptSpy;
    installEvent.userChoice = Promise.resolve({ outcome: 'accepted' });

    fireEvent(window, installEvent);

    const installBtn = await screen.findByRole('button', {
      name: /instalar nubi en este dispositivo/i,
    });
    fireEvent.click(installBtn);
    await waitFor(() => {
      expect(promptSpy).toHaveBeenCalledOnce();
    });

    fireEvent(window, new Event('offline'));
    expect(screen.getByText(/sin conexión/i)).toBeInTheDocument();
  });
});
