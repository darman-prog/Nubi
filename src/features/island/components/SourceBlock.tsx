import { useState, useCallback, useRef, useEffect } from 'react';
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
  const modalRef = useRef<HTMLDivElement>(null);

  // Registramos que el usuario abrió y leyó la evidencia científica.
  const handleOpen = (): void => {
    if (evidence) markSourceOpened(store, islandId, evidence.id);
    setOpen(true);
  };

  const handleClose = useCallback((): void => {
    setOpen(false);
  }, []);

  // Manejo accesible de tecla Escape para cerrar la hoja modal de fuente.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleClose]);

  if (!evidence || evidence.restricted) return null;

  return (
    <div className={styles.source}>
      <button
        type="button"
        className={styles.sourceButton}
        aria-expanded={open}
        aria-controls={`source-${evidence.id}`}
        onClick={handleOpen}
      >
        <span className={`${styles.sourceLevel} ${styles[`level_${evidence.level}`]}`}>
          ● {LEVEL_LABEL[evidence.level]}
        </span>
        Ver fuente
      </button>

      {open ? (
        <div className={styles.sourceModalOverlay}>
          {/* Velo translúcido con desenfoque de fondo */}
          <div
            className={styles.sourceModalScrim}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Hoja deslizante de fuente científica (05-hoja-fuente.html) */}
          <div
            ref={modalRef}
            id={`source-${evidence.id}`}
            className={styles.sourceModalSheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`source-title-${evidence.id}`}
            tabIndex={-1}
          >
            <div className={styles.dragHandle} aria-hidden="true" />

            <div className={styles.sourceSheetHeader}>
              <div className={styles.sourceHeaderTitle}>
                <span className={styles.sourceHeaderIcon} aria-hidden="true">
                  📖
                </span>
                <div>
                  <h2 id={`source-title-${evidence.id}`} className={styles.sourceSheetTitle}>
                    Fuente
                  </h2>
                  <p className={styles.sourceSheetSub}>Revisión científica · Evidencia</p>
                </div>
              </div>

              <button
                type="button"
                className={styles.sourceCloseBtn}
                onClick={handleClose}
                aria-label="Cerrar hoja de fuente"
              >
                ✕
              </button>
            </div>

            {/* 4 fichas estructuradas de evidencia */}
            <div className={styles.sourcePods}>
              <div className={styles.sourcePod}>
                <span className={styles.podTag}>CITA</span>
                <p className={styles.podCitation}>{evidence.source.citation}</p>
              </div>

              <div className={styles.sourcePod}>
                <span className={styles.podTag}>POBLACIÓN</span>
                <p className={styles.podText}>{evidence.population}</p>
              </div>

              <div className={styles.sourcePod}>
                <span className={styles.podTag}>DISEÑO</span>
                <p className={styles.podText}>{evidence.design}</p>
              </div>

              <div className={styles.sourcePod}>
                <span className={styles.podTag}>LIMITACIONES</span>
                <p className={styles.podText}>{evidence.limitations}</p>
              </div>
            </div>

            <button
              type="button"
              className={styles.sourceDoneBtn}
              onClick={handleClose}
            >
              Cerrar
            </button>

            <div className={styles.sourceFooter}>
              <div className={`${styles.evidenceBadge} ${styles[`level_${evidence.level}`]}`}>
                <span className={styles.badgeDot} />
                <span>{LEVEL_LABEL[evidence.level]}</span>
              </div>
              <p className={styles.sourceDisclaimer}>
                Esta app informa y no reemplaza a un profesional de la salud.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
