import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CloudTransitionHost } from '@/shared/ui/CloudTransition';
import { SkipLink } from '@/shared/ui/SkipLink';
import { AppRoutes } from './routes';
import styles from './App.module.css';

/** Composición raíz: router, telón de nubes y frontera de carga diferida. */
export default function App(): React.JSX.Element {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SkipLink />
      <CloudTransitionHost />
      <Suspense
        fallback={
          <p className={styles.loading} role="status">
            Cargando…
          </p>
        }
      >
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
