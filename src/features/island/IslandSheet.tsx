import { useParams } from 'react-router-dom';
import { ScreenPlaceholder } from '@/shared/ui/ScreenPlaceholder';

export default function IslandSheet(): React.JSX.Element {
  const { slug, etapa } = useParams();
  const note = etapa
    ? `Etapa: ${etapa}. Aquí vivirán la llegada, la historia, los retos y el sello.`
    : 'Aquí vivirán la llegada, la historia, los retos y el sello.';

  return <ScreenPlaceholder title={slug ? `Isla ${slug}` : 'Isla'} note={note} />;
}
