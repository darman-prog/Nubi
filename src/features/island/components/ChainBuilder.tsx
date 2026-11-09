import { useState } from 'react';
import { content } from '@/core/content/content-repository';
import type { Chain } from '../../../../content/schema';
import { Button } from '@/shared/ui/Button';
import styles from '../IslandSheet.module.css';

interface ChainBuilderProps {
  chain: Chain;
  onSolved: () => void;
}

const label = (id: string): string => content.nodeById(id)?.label ?? id;

export function ChainBuilder({ chain, onSolved }: ChainBuilderProps): React.JSX.Element {
  const [path, setPath] = useState<string[]>([chain.start]);
  const [error, setError] = useState(false);
  const current = path[path.length - 1];

  const outgoing = content.edges
    .filter((edge) => edge.status === 'published' && edge.from === current)
    .map((edge) => edge.to);
  const candidates = [...new Set([...outgoing, ...chain.distractors])].filter(
    (id) => !path.includes(id) || id === current,
  );

  const choose = (next: string): void => {
    if (chain.solution[path.length] !== next) {
      setError(true);
      return;
    }
    const nextPath = [...path, next];
    setPath(nextPath);
    setError(false);
    if (nextPath.length === chain.solution.length) onSolved();
  };

  const reset = (): void => {
    setPath([chain.start]);
    setError(false);
  };

  return (
    <div className={styles.chain}>
      <p className={styles.chainTitle}>{chain.title}</p>
      <p className={styles.chainHelp}>
        Conecta las causas y efectos tocando la pieza que sigue. Sin puntaje ni vidas.
      </p>

      {/* Camino visual de la cadena con flechas de conexión */}
      <ol className={styles.chainPath}>
        {path.map((id, index) => (
          <li key={id} className={styles.chainNode}>
            {index > 0 ? (
              <span className={styles.chainArrow} aria-hidden="true">
                →
              </span>
            ) : null}
            <span className={styles.nodeCard}>
              <span className={styles.nodeIndex}>{index + 1}</span>
              {label(id)}
            </span>
          </li>
        ))}
      </ol>

      <div className={styles.piecesContainer}>
        <span className={styles.piecesTitle}>Piezas disponibles:</span>
        <div className={styles.chainPieces}>
          {candidates.map((id) => (
            <button
              key={id}
              type="button"
              className={styles.piece}
              onClick={() => choose(id)}
            >
              <span className={styles.piecePlus} aria-hidden="true">
                +
              </span>
              {label(id)}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className={styles.chainError} role="status">
          Ese puente no va ahí. Puedes intentarlo otra vez con calma.
        </p>
      ) : null}

      <Button variant="ghost" onClick={reset}>
        Reiniciar cadena ↺
      </Button>
    </div>
  );
}
