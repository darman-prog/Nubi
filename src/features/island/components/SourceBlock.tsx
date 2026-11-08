import { useState } from 'react';
import { content } from '@/core/content/content-repository';
import { markSourceOpened } from '@/core/progress-service';
import { useUserStateStore } from '@/shared/state/UserStateContext';
import styles from '../IslandSheet.module.css';

const LEVEL_LABEL = {
  E3: 'Bien establecido',
  E2: 'Probable',
  E1: 'Aún se investiga',
} as const;

interface SourceBlockProps {
  islandId: string;
  evidenceId?: string;
}

export function SourceBlock({ islandId, evidenceId }: SourceBlockProps): React.JSX.Element | null {
  const store = useUserStateStore();
  const [open, setOpen] = useState(false);
  const evidence = evidenceId ? content.evidenceById(evidenceId) : undefined;

  if (!evidence || evidence.restricted) return null;

  const toggle = (): void => {
    if (!open) markSourceOpened(store, islandId, evidence.id);
    setOpen((value) => !value);
  };

  return (
    <div className={styles.source}>
      <button
        type="button"
        className={styles.sourceButton}
        aria-expanded={open}
        aria-controls={`source-${evidence.id}`}
        onClick={toggle}
      >
        <span className={styles.sourceLevel}>{LEVEL_LABEL[evidence.level]}</span>
        Ver fuente
      </button>
      {open ? (
        <div id={`source-${evidence.id}`} className={styles.sourceBody}>
          <p className={styles.sourceClaim}>{evidence.claimTechnical}</p>
          <dl className={styles.sourceList}>
            <div>
              <dt>Fuente</dt>
              <dd>{evidence.source.citation}</dd>
            </div>
            <div>
              <dt>Población</dt>
              <dd>{evidence.population}</dd>
            </div>
            <div>
              <dt>Diseño</dt>
              <dd>{evidence.design}</dd>
            </div>
            <div>
              <dt>Limitaciones</dt>
              <dd>{evidence.limitations}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
