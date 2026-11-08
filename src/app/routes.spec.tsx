import { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from './routes';

const renderRoute = (path: string) =>
  render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Suspense fallback={<p role="status">Cargando…</p>}>
        <AppRoutes />
      </Suspense>
    </MemoryRouter>,
  );

describe('AppRoutes', () => {
  it('renderiza el mapa en /mapa', async () => {
    renderRoute('/mapa');
    expect(await screen.findByRole('heading', { name: 'Mapa' })).toBeInTheDocument();
  });

  it('mantiene el mapa detrás del pasaporte', async () => {
    renderRoute('/pasaporte');
    expect(await screen.findByRole('heading', { name: 'Pasaporte' })).toBeInTheDocument();
  });

  it('abre la hoja de una isla', async () => {
    renderRoute('/isla/reloj');
    expect(await screen.findByRole('heading', { name: /isla reloj/i })).toBeInTheDocument();
  });

  it('renderiza la ayuda en pantalla completa', async () => {
    renderRoute('/ayuda');
    expect(await screen.findByRole('heading', { name: 'Ayuda' })).toBeInTheDocument();
  });

  it('muestra la pantalla de no encontrada', async () => {
    renderRoute('/no-existe');
    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument();
  });
});
