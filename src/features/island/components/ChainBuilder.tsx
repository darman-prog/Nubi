import { useMemo, useState } from 'react';
import { content } from '@/core/content/content-repository';
import {
  describeWeakestLevel,
  findMatchingPath,
  getChainHint,
} from '@/domain/graph/chain-hints';
import { findPaths } from '@/domain/graph/find-paths';
import { validateChain } from '@/domain/graph/validate-chain';
import { Button } from '@/shared/ui/Button';
import { EvidenceBadge } from '@/shared/ui/EvidenceBadge';
import { Icon } from '@/shared/ui/icons/Icon';
import type { Chain } from '../../../../content/schema';
import styles from '../IslandSheet.module.css';

interface ChainBuilderProps {
  chain: Chain;
  onSolved: () => void;
}

const label = (id: string): string => content.nodeById(id)?.label ?? id;

/** Armador de cadenas causales con validación por grafo, múltiples caminos y 3 niveles de pistas. */
export function ChainBuilder({ chain, onSolved }: ChainBuilderProps): React.JSX.Element {
  const [path, setPath] = useState<string[]>([chain.start]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2 | 3>(0);

  const validPaths = useMemo(() => {
    const discovered = findPaths(chain.start, chain.end, [...content.edges]);
    return discovered.length > 0 ? discovered : [chain.solution];
  }, [chain.start, chain.end, chain.solution]);

  const current = path[path.length - 1];
  const validation = useMemo(() => validateChain(path, [...content.edges]), [path]);
  const isSolved = current === chain.end && validation.status === 'correct';

  const outgoing = content.edges
    .filter((edge) => edge.status === 'published' && edge.from === current)
    .map((edge) => edge.to);
  const candidates = [...new Set([...outgoing, ...chain.distractors])].filter(
    (id) => !path.includes(id),
  );

  const choose = (next: string): void => {
    const nextPath = [...path, next];
    const check = validateChain(nextPath, [...content.edges]);
    if (check.status !== 'correct') {
      setFeedback('Ese puente no conecta aquí. Puedes intentarlo otra vez con calma.');
      return;
    }

    // Si el puente existe pero no tiene ruta hacia la meta, avisamos antes de atascar al usuario.
    const canReachGoal = Boolean(findMatchingPath(nextPath, validPaths));
    if (next !== chain.end && !canReachGoal) {
      setFeedback(`Ese puente es real, pero desde ahí no llegas a «${label(chain.end)}».`);
      return;
    }

    setPath(nextPath);
    setFeedback(null);
    setHintLevel(0);
  };

  const undo = (): void => {
    if (path.length <= 1) return;
    setPath((prev) => prev.slice(0, -1));
    setFeedback(null);
    setHintLevel(0);
  };

  const reset = (): void => {
    setPath([chain.start]);
    setFeedback(null);
    setHintLevel(0);
  };

  const nextHint = (): void => {
    setHintLevel((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 3));
  };

  const hintText =
    hintLevel === 0 ? null : getChainHint(hintLevel, path, validPaths, content.edges, label);

  return (
    <div className={styles.chain}>
      <p className={styles.chainTitle}>{chain.title}</p>
      <p className={styles.chainGoal}>Meta: {label(chain.end)}</p>
      <p className={styles.chainHelp}>
        Conecta las causas y efectos tocando la pieza que sigue. Sin puntaje ni vidas.
      </p>

      {/* Camino visual de la cadena con flechas y nivel de evidencia por enlace */}
      <ol className={styles.chainPath}>
        {path.map((id, index) => {
          const link = index > 0 ? validation.links[index - 1] : undefined;
          return (
            <li key={id} className={styles.chainNode}>
              {index > 0 ? (
                <span className={styles.chainArrow}>
                  <span aria-hidden="true">↓</span>
                  {link?.level ? <EvidenceBadge level={link.level} compact /> : null}
                </span>
              ) : null}
              <span className={styles.nodeCard}>
                <span className={styles.nodeIndex}>{index + 1}</span>
                {label(id)}
              </span>
            </li>
          );
        })}
      </ol>

      {!isSolved ? (
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
      ) : null}

      {feedback ? (
        <p className={styles.chainError} role="status">
          {feedback}
        </p>
      ) : null}

      {hintText ? (
        <p className={styles.chainHint} role="status">
          {hintText}
        </p>
      ) : null}

      {isSolved ? (
        <div className={styles.chainSolved} role="status">
          <p className={styles.chainSolvedTitle}>¡Cadena completa!</p>
          <p className={styles.chainHelp}>
            Eslabón más débil: {describeWeakestLevel(validation.weakest)}
          </p>
          <Button className={styles.cta} onClick={onSolved}>
            Reclamar sello <Icon name="medal" size={18} />
          </Button>
        </div>
      ) : null}

      <div className={styles.chainControls}>
        {!isSolved ? (
          <Button variant="ghost" onClick={nextHint} disabled={hintLevel === 3}>
            {hintLevel === 0 ? 'Pedir pista' : `Otra pista (${hintLevel}/3)`}
          </Button>
        ) : null}
        {path.length > 1 && !isSolved ? (
          <Button variant="ghost" onClick={undo}>
            Deshacer paso
          </Button>
        ) : null}
        <Button variant="ghost" onClick={reset}>
          Reiniciar cadena ↺
        </Button>
      </div>
    </div>
  );
}
