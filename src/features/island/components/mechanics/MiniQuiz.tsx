import { useState } from 'react';
import type { Pregunta } from '../../../../../content/schema';
import { Button } from '@/shared/ui/controls/Button';
import { Icon } from '@/shared/ui/icons/Icon';
import { SourceBlock } from '../SourceBlock';
import islandStyles from '../../IslandSheet.module.css';
import styles from './Mechanics.module.css';

interface MiniQuizProps {
  islandId: string;
  questions: Pregunta[];
  continueLabel: string;
  onDone: () => void;
}

/** MEC-03 · Quiz formativo (1 a 3 preguntas) con reintentos ilimitados y fuente verificada. */
export function MiniQuiz({
  islandId,
  questions,
  continueLabel,
  onDone,
}: MiniQuizProps): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [triedIds, setTriedIds] = useState<string[]>([]);
  const question = questions[index] ?? questions[0]!;
  const isLast = index >= questions.length - 1;
  const selected = question.opciones.find((option) => option.id === answer);
  const correct = selected?.correcta === true;

  // Registra opciones descartadas en la pregunta actual para dar feedback progresivo sin penalizar.
  const handleSelect = (optionId: string): void => {
    setAnswer(optionId);
    const chosen = question.opciones.find((option) => option.id === optionId);
    if (chosen && !chosen.correcta) {
      setTriedIds((prev) => (prev.includes(optionId) ? prev : [...prev, optionId]));
    }
  };

  const handleNext = (): void => {
    if (!isLast) {
      setIndex((prev) => prev + 1);
      setAnswer(null);
      setTriedIds([]);
      return;
    }
    onDone();
  };

  return (
    <div className={islandStyles.question}>
      {questions.length > 1 ? (
        <div className={styles.headerRow}>
          <span className={styles.counter}>
            Pregunta {index + 1} de {questions.length}
          </span>
          <div className={styles.stepDots} aria-hidden="true">
            {questions.map((q, i) => (
              <span
                key={q.id}
                className={`${styles.stepDot} ${i < index ? styles.stepDotDone : ''} ${i === index ? styles.stepDotCurrent : ''}`}
              />
            ))}
          </div>
        </div>
      ) : null}

      <h3 className={islandStyles.questionText}>{question.enunciado}</h3>
      <p className={islandStyles.questionHelp}>Puedes intentarlo las veces que quieras.</p>

      <div className={islandStyles.options} role="radiogroup" aria-label="Opciones de respuesta">
        {question.opciones.map((option) => {
          const isSelected = answer === option.id;
          const isTried = triedIds.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              className={`${islandStyles.option} ${isSelected ? islandStyles.optionSelected : ''} ${isTried && !isSelected ? islandStyles.optionTried : ''}`}
              aria-pressed={isSelected}
              onClick={() => handleSelect(option.id)}
            >
              <span className={islandStyles.optionText}>{option.texto}</span>
              {isTried && !option.correcta ? (
                <span className={islandStyles.triedBadge} aria-hidden="true">
                  Explorada
                </span>
              ) : null}
              <span className={islandStyles.optionRadio} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {answer ? (
        <div
          className={`${islandStyles.feedbackCard} ${correct ? islandStyles.feedbackCorrect : islandStyles.feedbackTryAgain}`}
          role="status"
        >
          <span className={islandStyles.feedbackIcon} aria-hidden="true">
            <Icon name={correct ? 'bulb' : 'sprout'} size={18} />
          </span>
          <p className={islandStyles.feedbackText}>
            {correct
              ? question.explicacion
              : triedIds.length > 1
                ? 'Ya descartaste varias opciones, ¡la respuesta está muy cerca!'
                : 'Casi. Esa pista nos acerca; puedes probar con otra de las opciones.'}
          </p>
        </div>
      ) : null}

      {answer ? <SourceBlock islandId={islandId} evidenceId={question.evidenceId} /> : null}

      {correct ? (
        <Button className={islandStyles.cta} onClick={handleNext}>
          {isLast ? continueLabel : 'Siguiente pregunta →'}
        </Button>
      ) : null}
    </div>
  );
}
