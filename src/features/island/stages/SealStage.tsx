import { artUrl } from '@/core/content/assets';
import type { Isla } from '../../../../content/schema';
import { Button } from '@/shared/ui/Button';
import styles from '../IslandSheet.module.css';

interface SealStageProps {
  island: Isla;
  claimed: boolean;
  next?: Isla;
  onClaim: () => void;
  onNext?: () => void;
  onMap: () => void;
  onPassport: () => void;
}

export function SealStage({
  island,
  claimed,
  next,
  onClaim,
  onNext,
  onMap,
  onPassport,
}: SealStageProps): React.JSX.Element {
  return (
    <div className={styles.stage}>
      <img className={styles.seal} src={artUrl(`arte/sellos/sello-${island.slug}.webp`)} alt="" />
      <img className={styles.nubi} src={artUrl('arte/nubi/nubi-celebrando.webp')} alt="" />
      <p className={styles.sceneAct}>{claimed ? 'Sello conseguido' : 'Tu sello'}</p>
      <h2 className={styles.sealTitle}>{island.nombre}</h2>
      <p className={styles.sealText}>
        {claimed
          ? 'Este sello ya está en tu pasaporte. Lo que aprendiste se queda contigo.'
          : 'Completa la isla y quédate con su sello en el pasaporte.'}
      </p>

      {!claimed ? (
        <Button className={styles.cta} onClick={onClaim}>
          Reclamar sello
        </Button>
      ) : (
        <>
          {next && onNext ? (
            <Button className={styles.cta} onClick={onNext}>
              Siguiente: {next.nombre}
            </Button>
          ) : null}
          <Button variant="secondary" onClick={onPassport}>
            Ver pasaporte
          </Button>
          <Button variant="ghost" onClick={onMap}>
            Volver al mapa
          </Button>
        </>
      )}
    </div>
  );
}
