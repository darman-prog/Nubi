import { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { UserStateProvider } from '@/shared/state/UserStateContext';
import { AppNav } from './AppNav';
import { AppRoutes } from './routes';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

const renderRoute = (path: string) => {
  const store = new UserStateStore(new StorageService(null, 0));
  return render(
    <MemoryRouter initialEntries={[path]} future={routerFuture}>
      <UserStateProvider store={store}>
        <Suspense fallback={<p role="status">Cargando…</p>}>
          <AppRoutes />
        </Suspense>
      </UserStateProvider>
    </MemoryRouter>,
  );
};

describe('AppRoutes', () => {
  it('renderiza el mapa en /mapa', async () => {
    const { container } = renderRoute('/mapa');
    expect(await screen.findByRole('heading', { name: 'Archipiélago' })).toBeInTheDocument();

    const nav = container.querySelector('nav');
    const main = container.querySelector('main');
    expect(nav).not.toBeNull();
    expect(main).not.toBeNull();
    expect(nav!.compareDocumentPosition(main!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('mantiene el mapa detrás del pasaporte', async () => {
    renderRoute('/pasaporte');
    expect(await screen.findByRole('heading', { name: 'Pasaporte' })).toBeInTheDocument();
  });

  it('abre la hoja de una isla por etapa después del main', async () => {
    const { container } = renderRoute('/isla/reloj/retos');
    expect(await screen.findByRole('heading', { name: /isla reloj/i })).toBeInTheDocument();

    const nav = container.querySelector('nav')!;
    const main = container.querySelector('main')!;
    const dialog = screen.getByRole('dialog');
    expect(nav.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(main.compareDocumentPosition(dialog) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renderiza el Diario como página con barra', async () => {
    renderRoute('/diario');
    expect(await screen.findByRole('heading', { name: 'Diario' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Diario' })).toHaveAttribute('aria-current', 'page');
  });

  it('renderiza la ayuda en página con barra', async () => {
    renderRoute('/ayuda');
    expect(await screen.findByRole('heading', { name: 'Ayuda' })).toBeInTheDocument();
  });

  it('muestra la pantalla de no encontrada', async () => {
    renderRoute('/no-existe');
    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument();
  });
});

describe('AppNav', () => {
  it('tiene cuatro destinos y marca el activo', () => {
    render(
      <MemoryRouter initialEntries={['/mapa']} future={routerFuture}>
        <AppNav />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('link')).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'Mapa' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Pasaporte' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Diario' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ayuda' })).toBeInTheDocument();
  });
});
