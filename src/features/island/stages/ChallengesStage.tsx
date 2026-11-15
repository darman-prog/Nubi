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
  onFinish: () => void;
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

  if (tabs.length === 0) {
    return (
      <div className={styles.stage}>
        <p>Esta isla no tiene retos. Su sello se gana en la historia.</p>
        <Button className={styles.cta} onClick={onFinish}>
          Ir al sello
        </Button>
      </div>
    );
  }

  const nextTabAfter = (id: TabId): TabId | undefined => {
    const idx = tabs.findIndex((item) => item.id === id);
    return idx >= 0 ? tabs[idx + 1]?.id : undefined;
  };

  const advanceOrFinish = (id: TabId): void => {
    const next = nextTabAfter(id);
    if (next) setActiveTab(next);
    else onFinish();
  };

  return (
    <div className={styles.stage}>
      <div className={styles.stageHeaderRow}>
        <span className={styles.phasePill}>Fase 3 · Retos</span>
        <span className={styles.calmBadge}>Sin prisas ni vidas</span>
      </div>

      {tabs.length > 1 ? (
        <div className={styles.tabSwitcher} role="tablist" aria-label="Actividades de la isla">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      {activeTab === 'quiz' && questions.length > 0 ? (
        <MiniQuiz
          islandId={island.id}
          questions={questions}
          continueLabel={nextTabAfter('quiz') ? 'Siguiente actividad →' : 'Reclamar sello →'}
          onDone={() => advanceOrFinish('quiz')}
        />
      ) : null}

      {activeTab === 'myth' && island.mitosRealidad ? (
        <MythOrFact
          islandId={island.id}
          items={island.mitosRealidad}
          onDone={() => advanceOrFinish('myth')}
        />
      ) : null}

      {activeTab === 'detective' && island.detectiveEstudios ? (
        <StudyDetective
          islandId={island.id}
          config={island.detectiveEstudios}
          onDone={() => advanceOrFinish('detective')}
        />
      ) : null}

      {activeTab === 'routine' && island.experimentos ? (
        <RoutineBuilder
          islandId={island.id}
          config={island.experimentos}
          onDone={() => advanceOrFinish('routine')}
        />
      ) : null}

      {activeTab === 'breath' && island.respiracion ? (
        <BreathingExercise
          islandId={island.id}
          config={island.respiracion}
          onDone={() => advanceOrFinish('breath')}
        />
      ) : null}

      {activeTab === 'chain' && chain ? (
        <div className={styles.chainBlock}>
          <ChainBuilder chain={chain} onSolved={onFinish} />
        </div>
      ) : null}
    </div>
  );
}
