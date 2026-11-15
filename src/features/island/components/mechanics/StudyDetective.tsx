import { useState } from 'react';
import type { DetectiveEstudios } from '../../../../../content/schema';
import { Button } from '@/shared/ui/controls/Button';
import { Icon } from '@/shared/ui/icons/Icon';
import { SourceBlock } from '../SourceBlock';
import islandStyles from '../../IslandSheet.module.css';
import styles from './Mechanics.module.css';

interface StudyDetectiveProps {
  islandId: string;
  config: DetectiveEstudios;
  continueLabel?: string;
  onDone?: () => void;
}

/** MEC-05 · Detective de estudios para comprender evidencia mixta sin absolutos. */
export function StudyDetective({
  islandId,
  config,
  continueLabel = 'Siguiente actividad →',
  onDone,
}: StudyDetectiveProps): React.JSX.Element {
  const [guesses, setGuesses] = useState<Record<string, boolean>>({});
  const [selectedVar, setSelectedVar] = useState<string | null>(null);

  const allClassified = config.estudios.every((study) => guesses[study.id] !== undefined);
  const pickedVar = config.variablesDiferencia.find((item) => item.id === selectedVar);
  const keyFound = pickedVar?.esClave === true;

  return (
    <div className={styles.box}>
      <div className={styles.promptCard}>
        <h3 className={styles.promptTitle}>{config.titulo}</h3>
        <p className={styles.helper}>
          1. Mira los tres estudios reales e indica en cuál se vio efecto en memoria.
        </p>
      </div>

      {config.estudios.map((study) => {
        const picked = guesses[study.id];
        const matches = picked === study.huboEfecto;
        return (
          <div key={study.id} className={styles.studyCard}>
            <strong>{study.nombre}</strong>
            <p className={styles.studyMeta}>
              {study.participantes} · {study.duracion} · Medida: {study.queMidieron}
            </p>
            <div className={styles.toggleTwo}>
              {[
                { value: true, label: 'Se vio efecto' },
                { value: false, label: 'No se vio efecto' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  className={styles.choiceBtn}
                  aria-pressed={picked === opt.value}
                  onClick={() => setGuesses((prev) => ({ ...prev, [study.id]: opt.value }))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Tarjeta de retroalimentación visual al clasificar cada estudio */}
            {picked !== undefined ? (
              <div
                className={`${islandStyles.feedbackCard} ${matches ? islandStyles.feedbackCorrect : islandStyles.feedbackTryAgain}`}
                role="status"
              >
                <span className={islandStyles.feedbackIcon} aria-hidden="true">
                  <Icon name={matches ? 'check' : 'sprout'} size={16} />
                </span>
                <p className={islandStyles.feedbackText}>
                  {matches
                    ? `¡Buen ojo! En este estudio ${study.huboEfecto ? 'sí se vio diferencia' : 'no hubo diferencia clara'}.`
                    : `Mirémoslo con calma: en este estudio ${study.huboEfecto ? 'sí se vio diferencia' : 'no hubo diferencia clara'}.`}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}

      {allClassified ? (
        <div className={styles.promptCard}>
          <h4 className={styles.promptTitle}>2. ¿Qué cambia entre estos estudios?</h4>
          <div className={islandStyles.options} role="radiogroup" aria-label="Qué cambia entre estudios">
            {config.variablesDiferencia.map((option) => {
              const active = selectedVar === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`${islandStyles.option} ${active ? islandStyles.optionSelected : ''}`}
                  aria-pressed={active}
                  onClick={() => setSelectedVar(option.id)}
                >
                  <span className={islandStyles.optionText}>{option.texto}</span>
                  <span className={islandStyles.optionRadio} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {keyFound ? (
        <div className={`${islandStyles.feedbackCard} ${islandStyles.feedbackCorrect}`} role="status">
          <span className={islandStyles.feedbackIcon} aria-hidden="true">
            <Icon name="bulb" size={18} />
          </span>
          <p className={islandStyles.feedbackText}>{config.hipotesisPlausible}</p>
        </div>
      ) : selectedVar ? (
        <p className={styles.helper}>Pista: compara las noches de sueño y el tipo de tarea medida.</p>
      ) : null}

      <SourceBlock islandId={islandId} evidenceId={config.evidenceId} />

      {keyFound && onDone ? (
        <Button className={islandStyles.cta} onClick={onDone}>
          {continueLabel}
        </Button>
      ) : null}
    </div>
  );
}
