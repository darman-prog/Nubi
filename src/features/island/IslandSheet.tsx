import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { content } from '@/core/content/content-repository';
import { Sheet } from '@/shared/ui/Sheet';

export default function IslandSheet(): React.JSX.Element {
  const { slug, etapa } = useParams();
  const navigate = useNavigate();
  const close = useCallback(() => navigate('/mapa'), [navigate]);
  const island = slug ? content.islandBySlug(slug) : undefined;

  const note =
    island?.disponibilidad === 'coming_soon'
      ? 'En construcción. Pronto habrá más.'
      : 'Aquí vivirán la llegada, la historia, los retos y el sello.';

  return (
    <Sheet title={island?.nombre ?? 'Isla'} onClose={close}>
      <p>{etapa ? `Etapa: ${etapa}. ` : ''}{note}</p>
    </Sheet>
  );
}
