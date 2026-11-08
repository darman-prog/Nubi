import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet } from '@/shared/ui/Sheet';

export default function PassportSheet(): React.JSX.Element {
  const navigate = useNavigate();
  const close = useCallback(() => navigate('/mapa'), [navigate]);

  return (
    <Sheet title="Pasaporte" onClose={close}>
      <p>Aquí vivirán los seis sellos y el acceso a la coronación.</p>
    </Sheet>
  );
}
