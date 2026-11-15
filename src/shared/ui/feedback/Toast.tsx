import { useEffect } from 'react';
import { cx } from '@/shared/lib/cx';
import { Icon, type IconName } from '../icons/Icon';
import styles from './Toast.module.css';

export type ToastTone = 'success' | 'info' | 'error';

const TONE_ICON: Record<ToastTone, IconName> = {
  success: 'check',
  info: 'sparkle',
  error: 'close',
};

interface ToastProps {
  message: string | null;
  tone?: ToastTone;
  durationMs?: number;
  onDismiss?: () => void;
  className?: string;
}

/** Región viva cortés para mensajes breves de confirmación o aviso (doc 04 §6). */
export function Toast({
  message,
  tone = 'success',
  durationMs = 4500,
  onDismiss,
  className,
}: ToastProps): React.JSX.Element {
  useEffect(() => {
    if (!message || !onDismiss || durationMs <= 0) return;
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  return (
    <div className={cx(styles.region, className)} role="status" aria-live="polite" aria-atomic="true">
      {message ? (
        <div className={cx(styles.toast, styles[tone])}>
          <Icon name={TONE_ICON[tone]} size={15} />
          <span className={styles.text}>{message}</span>
          {onDismiss ? (
            <button
              type="button"
              className={styles.dismiss}
              onClick={onDismiss}
              aria-label="Cerrar aviso"
            >
              <Icon name="close" size={14} />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
