import { useParams } from 'react-router-dom';
import { ScreenPlaceholder } from '@/shared/ui/ScreenPlaceholder';

export default function IslandSheet(): React.JSX.Element {
  const { slug } = useParams();

  return (
    <ScreenPlaceholder
      title={slug ? `Isla ${slug}` : 'Isla'}
      note="Aquí vivirán la llegada, la historia, los retos y el sello."
    />
  );
}
