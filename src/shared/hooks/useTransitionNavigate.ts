import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cloudTransition } from '@/shared/ui/CloudTransition';

/** Devuelve un navegador que cubre el cambio de vista con el telón de nubes. */
export const useTransitionNavigate = (): ((to: string) => void) => {
  const navigate = useNavigate();

  return useCallback(
    (to: string) => {
      void cloudTransition.go(() => {
        navigate(to);
      });
    },
    [navigate],
  );
};
