import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { createInitialState } from '@/core/user-state';
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

  it('exporta y valida importación JSON antes de reemplazar', async () => {
    const store = new UserStateStore(new StorageService(null, 0));
    const createUrl = vi.fn(() => 'blob:test');
    const revokeUrl = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: createUrl, revokeObjectURL: revokeUrl });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderHelp(store);

    fireEvent.click(screen.getByRole('button', { name: 'Exportar mi viaje' }));
    expect(createUrl).toHaveBeenCalledOnce();
    expect(clickSpy).toHaveBeenCalledOnce();
    clickSpy.mockRestore();
    expect(screen.getByText(/archivo de respaldo descargado/i)).toBeInTheDocument();

    const imported = createInitialState();
    imported.profile.nickname = 'Sofi';
    const fileInput = screen.getByLabelText(/seleccionar archivo json de respaldo/i);
    const validFile = new File([JSON.stringify(imported)], 'viaje.json', { type: 'application/json' });
    // jsdom antiguo no siempre implementa File.text(), aseguramos lectura determinista.
    Object.defineProperty(validFile, 'text', { value: async () => JSON.stringify(imported) });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sí, reemplazar progreso/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /sí, reemplazar progreso/i }));
    expect(store.getState().profile.nickname).toBe('Sofi');
  });

  it('muestra error claro si el archivo importado es inválido y exige doble confirmación para borrar', async () => {
    const store = new UserStateStore(new StorageService(null, 0));
    renderHelp(store);

    const fileInput = screen.getByLabelText(/seleccionar archivo json de respaldo/i);
    const badFile = new File(['{invalido'], 'malo.json', { type: 'application/json' });
    Object.defineProperty(badFile, 'text', { value: async () => '{invalido' });

    fireEvent.change(fileInput, { target: { files: [badFile] } });
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

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
