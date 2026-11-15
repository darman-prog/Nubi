import { useState } from 'react';
import { content } from '@/core/content/content-repository';
import type { Isla } from '../../../../content/schema';
import { Button } from '@/shared/ui/controls/Button';
import { ChainBuilder } from '../components/ChainBuilder';
import { BreathingExercise } from '../components/mechanics/BreathingExercise';
import { MiniQuiz } from '../components/mechanics/MiniQuiz';
import { MythOrFact } from '../components/mechanics/MythOrFact';
import { RoutineBuilder } from '../components/mechanics/RoutineBuilder';
import { StudyDetective } from '../components/mechanics/StudyDetective';
import styles from '../IslandSheet.module.css';

interface ChallengesStageProps {
  island: Isla;
  onFinish: (chainSolved?: boolean) => void;
}

type TabId = 'quiz' | 'myth' | 'detective' | 'routine' | 'breath' | 'chain';

export function ChallengesStage({ island, onFinish }: ChallengesStageProps): React.JSX.Element {
  const questions = island.miniQuiz ?? (island.pregunta ? [island.pregunta] : []);
  const chain = island.reto ? content.chainById(island.reto.chainId) : undefined;

  const tabs: Array<{ id: TabId; label: string }> = [
    ...(questions.length > 0
      ? [{ id: 'quiz' as const, label: questions.length > 1 ? `Quiz (${questions.length})` : 'Pregunta' }]
      : []),
    ...(island.mitosRealidad?.length ? [{ id: 'myth' as const, label: 'Mito o realidad' }] : []),
    ...(island.detectiveEstudios ? [{ id: 'detective' as const, label: 'Detective' }] : []),
    ...(island.experimentos ? [{ id: 'routine' as const, label: 'Mi rutina' }] : []),
    ...(island.respiracion ? [{ id: 'breath' as const, label: 'Respirar' }] : []),
    ...(chain ? [{ id: 'chain' as const, label: 'Cadena' }] : []),
  ];

  const [activeTab, setActiveTab] = useState<TabId>(tabs[0]?.id ?? 'quiz');
  const [completed, setCompleted] = useState<TabId[]>([]);

  if (tabs.length === 0) {
    return (
      <div className={styles.stage}>
        <p>Esta isla no tiene retos. Su sello se gana en la historia.</p>
        <Button className={styles.cta} onClick={() => onFinish(false)}>
          Ir al sello
        </Button>
      </div>
    );
  }

  // El sello exige completar al menos 3 actividades (cualquier combinación en islas de 4).
  const requiredCount = Math.min(3, tabs.length);

  const isSealUnlocked = (done: TabId[]): boolean => done.length >= requiredCount;

  const wouldUnlockSeal = (id: TabId): boolean =>
    isSealUnlocked(completed.includes(id) ? completed : [...completed, id]);

  const nextPendingAfter = (id: TabId, done: TabId[]): TabId | undefined => {
    const currentIndex = tabs.findIndex((item) => item.id === id);
    const after = tabs.slice(currentIndex + 1).find((item) => !done.includes(item.id));
    return after?.id ?? tabs.find((item) => !done.includes(item.id))?.id;
  };

  const completeActivity = (id: TabId): void => {
    const nextCompleted = completed.includes(id) ? completed : [...completed, id];
    setCompleted(nextCompleted);
    if (isSealUnlocked(nextCompleted)) {
      onFinish(nextCompleted.includes('chain'));
      return;
    }
    const next = nextPendingAfter(id, nextCompleted);
    if (next) setActiveTab(next);
  };

  const actionLabelFor = (id: TabId): string =>
    wouldUnlockSeal(id) ? 'Reclamar sello →' : 'Siguiente actividad →';

  return (
    <div className={styles.stage}>
      <div className={styles.stageHeaderRow}>
        <span className={styles.phasePill}>Fase 3 · Retos</span>
        <span className={styles.calmBadge}>
          Sello: {Math.min(completed.length, requiredCount)}/{requiredCount}
        </span>
      </div>

      {tabs.length > 1 ? (
        <div className={styles.tabSwitcher} role="tablist" aria-label="Actividades de la isla">
          {tabs.map((tab) => {
            const isDone = completed.includes(tab.id);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.tabBtn} ${isDone ? styles.tabBtnDone : ''} ${isActive ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {isDone ? (
                  <>
                    <span className={styles.tabCheck} aria-hidden="true">
                      ✓
                    </span>
                    <span className={styles.stageLabel}>Completada: </span>
                  </>
                ) : null}
                {tab.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {tabs.length > requiredCount ? (
        <p className={styles.calmBadge}>
          Completa {requiredCount} de {tabs.length} actividades para reclamar tu sello.
        </p>
      ) : null}

      {activeTab === 'quiz' && questions.length > 0 ? (
        <MiniQuiz
          islandId={island.id}
          questions={questions}
          continueLabel={actionLabelFor('quiz')}
          onDone={() => completeActivity('quiz')}
        />
      ) : null}

      {activeTab === 'myth' && island.mitosRealidad ? (
        <MythOrFact
          islandId={island.id}
          items={island.mitosRealidad}
          continueLabel={actionLabelFor('myth')}
          onDone={() => completeActivity('myth')}
        />
      ) : null}

      {activeTab === 'detective' && island.detectiveEstudios ? (
        <StudyDetective
          islandId={island.id}
          config={island.detectiveEstudios}
          continueLabel={actionLabelFor('detective')}
          onDone={() => completeActivity('detective')}
        />
      ) : null}

      {activeTab === 'routine' && island.experimentos ? (
        <RoutineBuilder
          islandId={island.id}
          config={island.experimentos}
          continueLabel={actionLabelFor('routine')}
          onDone={() => completeActivity('routine')}
        />
      ) : null}

      {activeTab === 'breath' && island.respiracion ? (
        <BreathingExercise
          islandId={island.id}
          config={island.respiracion}
          continueLabel={actionLabelFor('breath')}
          onDone={() => completeActivity('breath')}
        />
      ) : null}

      {activeTab === 'chain' && chain ? (
        <div className={styles.chainBlock}>
          <ChainBuilder
            chain={chain}
            continueLabel={wouldUnlockSeal('chain') ? undefined : 'Siguiente actividad →'}
            onSolved={() => completeActivity('chain')}
          />
        </div>
      ) : null}
    </div>
  );
}
