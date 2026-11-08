import { useCallback, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';
import styles from './Sheet.module.css';

interface SheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Hoja modal única para móvil y desktop; el ancho lo fija la columna de ADR-016. */
export function Sheet({ title, onClose, children }: SheetProps): React.JSX.Element {
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = useCallback(() => onClose(), [onClose]);
  useFocusTrap(sheetRef, close);

  return (
    <div className={styles.backdrop}>
      {/* El velo es solo puntero; el cierre accesible es el botón Cerrar o Esc. */}
      <button
        type="button"
        className={styles.scrim}
        onClick={close}
        tabIndex={-1}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h1 id={titleId} className={styles.title}>
            {title}
          </h1>
          <button type="button" className={styles.close} onClick={close} aria-label="Cerrar">
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
