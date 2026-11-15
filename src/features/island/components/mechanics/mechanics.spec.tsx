import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { content } from '@/core/content/content-repository';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { UserStateProvider } from '@/shared/state/UserStateContext';
import { BreathingExercise } from './BreathingExercise';
import { MiniQuiz } from './MiniQuiz';
import { MythOrFact } from './MythOrFact';
import { RoutineBuilder } from './RoutineBuilder';
import { StudyDetective } from './StudyDetective';
import { WeekSimulator } from './WeekSimulator';

const wrap = (ui: React.ReactElement, store = new UserStateStore(new StorageService(null, 0))) => ({
  store,
  ...render(<UserStateProvider store={store}>{ui}</UserStateProvider>),
});

describe('Mecánicas MVP (MEC-02..MEC-07)', () => {
  it('MEC-02 MythOrFact clasifica Mito / Realidad / Depende y muestra explicación', () => {
    const cerebro = content.islandBySlug('cerebro')!;
    wrap(<MythOrFact islandId={cerebro.id} items={cerebro.mitosRealidad!} />);

    fireEvent.click(screen.getByRole('button', { name: 'Depende' }));
    expect(screen.getByText(/depende:/i)).toBeInTheDocument();
  });

  it('MEC-03 MiniQuiz avanza por las 3 preguntas sin puntaje', () => {
    const reloj = content.islandBySlug('reloj')!;
    const onDone = vi.fn();
    wrap(
      <MiniQuiz
        islandId={reloj.id}
        questions={reloj.miniQuiz!}
        continueLabel="Seguir"
        onDone={onDone}
      />,
    );

    expect(screen.getByText('Pregunta 1 de 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /su reloj biológico se corre/i }));
    fireEvent.click(screen.getByRole('button', { name: /siguiente pregunta/i }));
    expect(screen.getByText('Pregunta 2 de 3')).toBeInTheDocument();
  });

  it('MEC-04 WeekSimulator calcula horas de colegio y fin de semana frente a 8-10 h', () => {
    const horarios = content.islandBySlug('horarios')!;
    wrap(<WeekSimulator islandId={horarios.id} config={horarios.simuladorSemana!} />);

    expect(screen.getByText(/entre semana duermes/i)).toBeInTheDocument();
    expect(screen.getByText(/se recomienda entre 8 y 10 h/i)).toBeInTheDocument();
  });

  it('MEC-05 StudyDetective clasifica los 3 estudios y revela hipótesis plausible', () => {
    const cerebro = content.islandBySlug('cerebro')!;
    wrap(<StudyDetective islandId={cerebro.id} config={cerebro.detectiveEstudios!} />);

    const noEffectButtons = screen.getAllByRole('button', { name: 'No se vio efecto' });
    const effectButtons = screen.getAllByRole('button', { name: 'Se vio efecto' });
    fireEvent.click(noEffectButtons[0]!);
    fireEvent.click(noEffectButtons[1]!);
    fireEvent.click(effectButtons[2]!);

    fireEvent.click(screen.getByRole('button', { name: /cuántas noches restringieron/i }));
    expect(screen.getByText(/hipótesis plausible/i)).toBeInTheDocument();
  });

  it('MEC-06 RoutineBuilder limita a 3 experimentos y guarda en el estado del usuario', () => {
    const taller = content.islandBySlug('taller')!;
    const { store } = wrap(<RoutineBuilder islandId={taller.id} config={taller.experimentos!} />);

    const items = taller.experimentos!.opciones;
    items.slice(0, 3).forEach((opt) => {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(opt.titulo, 'i') }));
    });
    expect(screen.getByRole('button', { name: new RegExp(items[3]!.titulo, 'i') })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /guardar experimento de 7 días/i }));
    expect(store.getState().experiments[0]?.items).toHaveLength(3);
  });

  it('MEC-07 BreathingExercise inicia y detiene la guía sin promesas clínicas', () => {
    const taller = content.islandBySlug('taller')!;
    wrap(<BreathingExercise islandId={taller.id} config={taller.respiracion!} />);

    fireEvent.click(screen.getByRole('button', { name: /iniciar respiración/i }));
    expect(screen.getByText(/inhala suave/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /detener/i }));
    expect(screen.getByText(/listo cuando tú quieras/i)).toBeInTheDocument();
  });
});
