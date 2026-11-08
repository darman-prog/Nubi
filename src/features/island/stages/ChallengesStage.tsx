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
  const [showChain, setShowChain] = useState(!question);

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
      {question ? (
        <div className={styles.question}>
          <p className={styles.sceneAct}>Pregunta</p>
          <p className={styles.questionText}>{question.enunciado}</p>
          <div className={styles.options}>
            {question.opciones.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${styles.option} ${answer === option.id ? styles.optionSelected : ''}`}
                aria-pressed={answer === option.id}
                onClick={() => setAnswer(option.id)}
              >
                {option.texto}
              </button>
            ))}
          </div>
          {answer ? (
            <p className={styles.feedback} role="status">
              {correct ? question.explicacion : 'Casi. Puedes probar otra opción.'}
            </p>
          ) : null}
          <SourceBlock islandId={island.id} evidenceId={question.evidenceId} />
          {correct ? (
            <Button
              className={styles.cta}
              onClick={() => (chain ? setShowChain(true) : onFinish())}
            >
              {chain ? 'Continuar a la cadena' : 'Ir al sello'}
            </Button>
          ) : null}
        </div>
      ) : null}

      {chain && showChain ? (
        <div className={styles.chainBlock}>
          <p className={styles.sceneAct}>Reto</p>
          <p className={styles.questionText}>{island.reto?.titulo}</p>
          <ChainBuilder chain={chain} onSolved={onFinish} />
        </div>
      ) : null}
    </div>
  );
}
