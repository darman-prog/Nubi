import { useState } from 'react';
import { content } from '@/core/content/content-repository';
import type { Isla } from '../../../../content/schema';
import { Button } from '@/shared/ui/Button';
import { ChainBuilder } from '../components/ChainBuilder';
import { SourceBlock } from '../components/SourceBlock';
import styles from '../IslandSheet.module.css';

interface ChallengesStageProps {
  island: Isla;
  onFinish: () => void;
}

export function ChallengesStage({ island, onFinish }: ChallengesStageProps): React.JSX.Element {
  const question = island.pregunta;
  const chain = island.reto ? content.chainById(island.reto.chainId) : undefined;
  const [answer, setAnswer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'question' | 'chain'>(question ? 'question' : 'chain');

  if (!question && !chain) {
    return (
      <div className={styles.stage}>
        <p>Esta isla no tiene retos. Su sello se gana en la historia.</p>
        <Button className={styles.cta} onClick={onFinish}>
          Ir al sello
        </Button>
      </div>
    );
  }

  const selected = question?.opciones.find((option) => option.id === answer);
  const correct = selected?.correcta === true;

  return (
    <div className={styles.stage}>
      <div className={styles.stageHeaderRow}>
        <span className={styles.phasePill}>Fase 3 · Retos</span>
        <span className={styles.calmBadge}>Sin prisas ni vidas</span>
      </div>

      {/* Selector superior interactivo si la isla tiene tanto pregunta como cadena (06-isla-retos.html) */}
      {question && chain ? (
        <div className={styles.tabSwitcher} role="tablist" aria-label="Secciones del reto">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'question'}
            className={`${styles.tabBtn} ${activeTab === 'question' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('question')}
          >
            A · Pregunta
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'chain'}
            className={`${styles.tabBtn} ${activeTab === 'chain' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('chain')}
          >
            B · Cadena
          </button>
        </div>
      ) : null}

      {question && activeTab === 'question' ? (
        <div className={styles.question}>
          <h3 className={styles.questionText}>{question.enunciado}</h3>
          <p className={styles.questionHelp}>Descubre la relación de causa y efecto en esta isla.</p>

          <div className={styles.options} role="radiogroup" aria-label="Opciones de respuesta">
            {question.opciones.map((option) => {
              const isSelected = answer === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => setAnswer(option.id)}
                >
                  <span className={styles.optionText}>{option.texto}</span>
                  <span className={styles.optionRadio} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          {answer ? (
            <div className={`${styles.feedbackCard} ${correct ? styles.feedbackCorrect : styles.feedbackTryAgain}`} role="status">
              <span className={styles.feedbackIcon} aria-hidden="true">
                {correct ? '💡' : '🌱'}
              </span>
              <p className={styles.feedbackText}>
                {correct ? question.explicacion : 'Casi. Puedes probar con otra de las opciones.'}
              </p>
            </div>
          ) : null}

          <SourceBlock islandId={island.id} evidenceId={question.evidenceId} />

          {correct ? (
            <Button
              className={styles.cta}
              onClick={() => (chain ? setActiveTab('chain') : onFinish())}
            >
              {chain ? 'Continuar al reto de cadena →' : 'Reclamar sello 🏅'}
            </Button>
          ) : null}
        </div>
      ) : null}

      {chain && activeTab === 'chain' ? (
        <div className={styles.chainBlock}>
          <h3 className={styles.questionText}>{island.reto?.titulo}</h3>
          <ChainBuilder chain={chain} onSolved={onFinish} />
        </div>
      ) : null}
    </div>
  );
}
