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
  const question = questions[index] ?? questions[0]!;
  const isLast = index >= questions.length - 1;
  const selected = question.opciones.find((option) => option.id === answer);
  const correct = selected?.correcta === true;

  const handleNext = (): void => {
    if (!isLast) {
      setIndex((prev) => prev + 1);
      setAnswer(null);
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
        </div>
      ) : null}

      <h3 className={islandStyles.questionText}>{question.enunciado}</h3>
      <p className={islandStyles.questionHelp}>Puedes intentarlo las veces que quieras.</p>

      <div className={islandStyles.options} role="radiogroup" aria-label="Opciones de respuesta">
        {question.opciones.map((option) => {
          const isSelected = answer === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`${islandStyles.option} ${isSelected ? islandStyles.optionSelected : ''}`}
              aria-pressed={isSelected}
              onClick={() => setAnswer(option.id)}
            >
              <span className={islandStyles.optionText}>{option.texto}</span>
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
            {correct ? question.explicacion : 'Casi. Puedes probar con otra de las opciones.'}
          </p>
        </div>
      ) : null}

      <SourceBlock islandId={islandId} evidenceId={question.evidenceId} />

      {correct ? (
        <Button className={islandStyles.cta} onClick={handleNext}>
          {isLast ? continueLabel : 'Siguiente pregunta →'}
        </Button>
      ) : null}
    </div>
  );
}
