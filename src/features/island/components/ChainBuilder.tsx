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
      <ol className={styles.chainPath}>
        {path.map((id) => (
          <li key={id}>{label(id)}</li>
        ))}
      </ol>
      <p className={styles.chainHelp}>Toca la pieza que sigue. No hay puntaje ni vidas.</p>
      <div className={styles.chainPieces}>
        {candidates.map((id) => (
          <button key={id} type="button" className={styles.piece} onClick={() => choose(id)}>
            {label(id)}
          </button>
        ))}
      </div>
      {error ? (
        <p className={styles.chainError} role="status">
          Ese puente no va ahí. Puedes intentarlo otra vez.
        </p>
      ) : null}
      <Button variant="ghost" onClick={reset}>
        Reiniciar cadena
      </Button>
    </div>
  );
}
