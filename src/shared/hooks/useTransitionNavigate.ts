import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cloudTransition } from '@/shared/ui/CloudTransition';

interface TransitionNavigateOptions {
  /** Las hojas que se deslizan solas (pasaporte) no necesitan el telón de nubes. */
  cloud?: boolean;
}

/** Devuelve un navegador que cubre el cambio de vista con el telón de nubes. */
export const useTransitionNavigate = (): ((
  to: string,
  options?: TransitionNavigateOptions,
) => void) => {
  const navigate = useNavigate();

  return useCallback(
    (to: string, { cloud = true }: TransitionNavigateOptions = {}) => {
      if (!cloud) {
        navigate(to);
        return;
      }
      void cloudTransition.go(() => {
        navigate(to);
      });
    },
    [navigate],
  );
};
