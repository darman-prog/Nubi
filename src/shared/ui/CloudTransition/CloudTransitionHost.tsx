import { useEffect } from 'react';
import { cloudTransition } from './CloudTransition';

/** Monta el telón una sola vez y lo retira al desmontar la app. */
export function CloudTransitionHost(): null {
  useEffect(() => {
    cloudTransition.mount();
    return () => cloudTransition.unmount();
  }, []);

  return null;
}
