import { useState } from 'react';
import type { MitoItem } from '../../../../../content/schema';
import { Button } from '@/shared/ui/controls/Button';
import { Icon } from '@/shared/ui/icons/Icon';
import { SourceBlock } from '../SourceBlock';
import islandStyles from '../../IslandSheet.module.css';
import styles from './Mechanics.module.css';

interface MythOrFactProps {
  islandId: string;
  items: MitoItem[];
  onDone?: () => void;
}

const LABELS: Array<{ value: MitoItem['veredicto']; label: string }> = [
  { value: 'mito', label: 'Mito' },
  { value: 'realidad', label: 'Realidad' },
  { value: 'depende', label: 'Depende' },
];

/** MEC-02 · Mito o realidad sin puntaje ni reloj; admite evidencia mixta ("Depende"). */
export function MythOrFact({ islandId, items, onDone }: MythOrFactProps): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<MitoItem['veredicto'] | null>(null);
  const current = items[index] ?? items[0]!;
  const isLast = index >= items.length - 1;
  const matched = choice === current.veredicto;

  const advance = (): void => {
    if (!isLast) {
      setIndex((prev) => prev + 1);
      setChoice(null);
      return;
    }
    onDone?.();
  };

  return (
    <div className={styles.box}>
      <div className={styles.headerRow}>
        <span className={styles.counter}>
          Afirmación {index + 1} de {items.length}
        </span>
        <span className={islandStyles.calmBadge}>Sin puntaje ni reloj</span>
      </div>

      <div className={styles.promptCard}>
        <h3 className={styles.promptTitle}>&ldquo;{current.afirmacion}&rdquo;</h3>
        <p className={styles.helper}>Elige si esta idea es mito, realidad o depende del caso.</p>
      </div>

      <div className={styles.choiceRow} role="group" aria-label="Clasificar afirmación">
        {LABELS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={styles.choiceBtn}
            aria-pressed={choice === item.value}
            onClick={() => setChoice(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {choice ? (
        <div
          className={`${islandStyles.feedbackCard} ${matched ? islandStyles.feedbackCorrect : islandStyles.feedbackTryAgain}`}
          role="status"
        >
          <span className={islandStyles.feedbackIcon} aria-hidden="true">
            <Icon name={matched ? 'bulb' : 'sprout'} size={18} />
          </span>
          <p className={islandStyles.feedbackText}>
            <strong>{LABELS.find((l) => l.value === current.veredicto)?.label}:</strong>{' '}
            {current.explicacion}
          </p>
        </div>
      ) : null}

      <SourceBlock islandId={islandId} evidenceId={current.evidenceId} />

      {choice && (onDone || !isLast) ? (
        <Button className={islandStyles.cta} onClick={advance}>
          {isLast ? 'Siguiente actividad →' : 'Siguiente afirmación →'}
        </Button>
      ) : null}
    </div>
  );
}
