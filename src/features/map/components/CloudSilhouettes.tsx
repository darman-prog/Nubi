/** Siluetas de nube del mockup 02; los ids se usan desde CloudCard. */
export function CloudSilhouettes(): React.JSX.Element {
  return (
    <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <g id="shape-v1">
          <rect vectorEffect="non-scaling-stroke" x="14" y="26" width="272" height="58" rx="24" />
          <circle vectorEffect="non-scaling-stroke" cx="150" cy="26" r="22" />
          <circle vectorEffect="non-scaling-stroke" cx="112" cy="34" r="20" />
          <circle vectorEffect="non-scaling-stroke" cx="80" cy="32" r="16" />
          <circle vectorEffect="non-scaling-stroke" cx="188" cy="34" r="20" />
          <circle vectorEffect="non-scaling-stroke" cx="220" cy="32" r="16" />
        </g>
        <symbol id="cloud-v1" viewBox="0 0 300 100" preserveAspectRatio="none">
          <rect x="14" y="32" width="272" height="58" rx="24" style={{ fill: 'var(--slab,#E2DCF8)', stroke: 'none' }} />
          <use
            href="#shape-v1"
            style={{
              fill: 'none',
              stroke: 'var(--stroke,#CFC6F5)',
              strokeWidth: 'calc(var(--sw,1.5) * 2px)',
              strokeLinejoin: 'round',
              strokeDasharray: 'var(--dash,none)',
            }}
          />
          <use href="#shape-v1" style={{ fill: 'var(--fill,#FFFFFF)', stroke: 'none' }} />
        </symbol>

        <g id="shape-v2">
          <rect vectorEffect="non-scaling-stroke" x="14" y="26" width="272" height="58" rx="24" />
          <circle vectorEffect="non-scaling-stroke" cx="128" cy="28" r="22" />
          <circle vectorEffect="non-scaling-stroke" cx="92" cy="36" r="18" />
          <circle vectorEffect="non-scaling-stroke" cx="62" cy="30" r="14" />
          <circle vectorEffect="non-scaling-stroke" cx="164" cy="34" r="18" />
          <circle vectorEffect="non-scaling-stroke" cx="196" cy="32" r="16" />
          <circle vectorEffect="non-scaling-stroke" cx="222" cy="36" r="14" />
        </g>
        <symbol id="cloud-v2" viewBox="0 0 300 100" preserveAspectRatio="none">
          <rect x="14" y="32" width="272" height="58" rx="24" style={{ fill: 'var(--slab,#E2DCF8)', stroke: 'none' }} />
          <use
            href="#shape-v2"
            style={{
              fill: 'none',
              stroke: 'var(--stroke,#CFC6F5)',
              strokeWidth: 'calc(var(--sw,1.5) * 2px)',
              strokeLinejoin: 'round',
              strokeDasharray: 'var(--dash,none)',
            }}
          />
          <use href="#shape-v2" style={{ fill: 'var(--fill,#FFFFFF)', stroke: 'none' }} />
        </symbol>

        <g id="shape-v3">
          <rect vectorEffect="non-scaling-stroke" x="14" y="26" width="272" height="58" rx="24" />
          <circle vectorEffect="non-scaling-stroke" cx="172" cy="28" r="22" />
          <circle vectorEffect="non-scaling-stroke" cx="208" cy="36" r="18" />
          <circle vectorEffect="non-scaling-stroke" cx="238" cy="30" r="14" />
          <circle vectorEffect="non-scaling-stroke" cx="136" cy="34" r="18" />
          <circle vectorEffect="non-scaling-stroke" cx="104" cy="32" r="16" />
          <circle vectorEffect="non-scaling-stroke" cx="78" cy="36" r="14" />
        </g>
        <symbol id="cloud-v3" viewBox="0 0 300 100" preserveAspectRatio="none">
          <rect x="14" y="32" width="272" height="58" rx="24" style={{ fill: 'var(--slab,#E2DCF8)', stroke: 'none' }} />
          <use
            href="#shape-v3"
            style={{
              fill: 'none',
              stroke: 'var(--stroke,#CFC6F5)',
              strokeWidth: 'calc(var(--sw,1.5) * 2px)',
              strokeLinejoin: 'round',
              strokeDasharray: 'var(--dash,none)',
            }}
          />
          <use href="#shape-v3" style={{ fill: 'var(--fill,#FFFFFF)', stroke: 'none' }} />
        </symbol>
      </defs>
    </svg>
  );
}
