import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { content } from '@/core/content/content-repository';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { UserStateProvider } from '@/shared/state/UserStateContext';
import { ChallengesStage } from './ChallengesStage';

const renderChallenges = (slug: string, onFinish = vi.fn()) => {
  const island = content.islandBySlug(slug)!;
  const store = new UserStateStore(new StorageService(null, 0));
  return {
    island,
    onFinish,
    ...render(
      <UserStateProvider store={store}>
        <ChallengesStage island={island} onFinish={onFinish} />
      </UserStateProvider>,
    ),
  };
};

const solveQuiz = (slug: string) => {
  const island = content.islandBySlug(slug)!;
  const q = island.pregunta ?? island.miniQuiz![0]!;
  const right = q.opciones.find((o) => o.correcta)!;
  fireEvent.click(screen.getByRole('button', { name: right.texto }));
};

const solveMyth = (slug: string) => {
  const island = content.islandBySlug(slug)!;
  const labels = { mito: 'Mito', realidad: 'Realidad', depende: 'Depende' } as const;
  const item = island.mitosRealidad![0]!;
  fireEvent.click(screen.getByRole('button', { name: labels[item.veredicto] }));
};

const solveDetective = (slug: string) => {
  const detective = content.islandBySlug(slug)!.detectiveEstudios!;
  detective.estudios.forEach((study, idx) => {
    const label = study.huboEfecto ? 'Se vio efecto' : 'No se vio efecto';
    const buttons = screen.getAllByRole('button', { name: label });
    const target = buttons[idx] ?? buttons[0]!;
    fireEvent.click(target);
  });
  const keyOption = detective.variablesDiferencia.find((v) => v.esClave)!;
  fireEvent.click(screen.getByRole('button', { name: keyOption.texto }));
};

const solveChain = (slug: string) => {
  const chainId = content.islandBySlug(slug)!.reto!.chainId;
  const chain = content.chainById(chainId)!;
  for (const nodeId of chain.solution.slice(1)) {
    const label = content.nodeById(nodeId)?.label ?? nodeId;
    fireEvent.click(screen.getByRole('button', { name: new RegExp(label, 'i') }));
  }
};

describe('ChallengesStage · regla 3 de 4 actividades (Cadena opcional)', () => {
  it('desbloquea el sello al completar 3 actividades sin hacer Cadena en isla de 4', () => {
    const { onFinish } = renderChallenges('cerebro');

    expect(screen.getByText('Sello: 0/3')).toBeInTheDocument();
    expect(screen.getByText(/completa 3 de 4 actividades para reclamar tu sello/i)).toBeInTheDocument();

    solveQuiz('cerebro');
    fireEvent.click(screen.getByRole('button', { name: /siguiente actividad/i }));
    expect(screen.getByText('Sello: 1/3')).toBeInTheDocument();

    solveMyth('cerebro');
    fireEvent.click(screen.getByRole('button', { name: /siguiente actividad/i }));
    expect(screen.getByText('Sello: 2/3')).toBeInTheDocument();

    // Completa Detective como 3ra actividad sin tocar Cadena y reclama el sello.
    solveDetective('cerebro');
    fireEvent.click(screen.getByRole('button', { name: /reclamar sello/i }));
    expect(onFinish).toHaveBeenCalledWith(false);
  });

  it('desbloquea el sello al completar 3 actividades incluyendo Cadena en isla de 4', () => {
    const { onFinish } = renderChallenges('cerebro');

    solveQuiz('cerebro');
    fireEvent.click(screen.getByRole('button', { name: /siguiente actividad/i }));

    solveMyth('cerebro');
    fireEvent.click(screen.getByRole('button', { name: /siguiente actividad/i }));

    // Salta Detective y elige Cadena como 3ra actividad.
    fireEvent.click(screen.getByRole('tab', { name: 'Cadena' }));
    solveChain('cerebro');
    fireEvent.click(screen.getByRole('button', { name: /reclamar sello/i }));
    expect(onFinish).toHaveBeenCalledWith(true);
  });

  it('si resuelve Cadena primero, pide completar 2 actividades más antes de dar el sello', () => {
    const { onFinish } = renderChallenges('cerebro');

    fireEvent.click(screen.getByRole('tab', { name: 'Cadena' }));
    solveChain('cerebro');
    fireEvent.click(screen.getByRole('button', { name: /siguiente actividad/i }));
    expect(onFinish).not.toHaveBeenCalled();
    expect(screen.getByText('Sello: 1/3')).toBeInTheDocument();

    solveQuiz('cerebro');
    fireEvent.click(screen.getByRole('button', { name: /siguiente actividad/i }));
    expect(screen.getByText('Sello: 2/3')).toBeInTheDocument();

    solveMyth('cerebro');
    fireEvent.click(screen.getByRole('button', { name: /reclamar sello/i }));
    expect(onFinish).toHaveBeenCalledWith(true);
  });
});
