import type { ButtonHTMLAttributes } from 'react';
import { cx } from '@/shared/lib/cx';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...rest
}: ButtonProps): React.JSX.Element {
  return <button type={type} className={cx(styles.button, styles[variant], className)} {...rest} />;
}
