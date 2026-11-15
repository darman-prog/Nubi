import type { ReactNode } from 'react';

export type IconName =
  | 'sun' | 'wind' | 'shield' | 'heart' | 'cloud' | 'book' | 'medal'
  | 'telescope' | 'close' | 'bulb' | 'sprout' | 'leaf' | 'check'
  | 'flask' | 'sparkle' | 'compass' | 'lock' | 'graduation' | 'crown'
  | 'chevron-up' | 'dot' | 'moon'
  | 'nav-map' | 'nav-passport' | 'nav-diary' | 'nav-help'
  | 'evidence-e3' | 'evidence-e2' | 'evidence-e1'
  | 'mood-1' | 'mood-2' | 'mood-3' | 'mood-4' | 'mood-5';

// Sistema: grid 24×24 · área viva 2–22 · stroke-width 2 (o 1.8 en navegación)
// stroke-linecap/linejoin: round · fill: none (salvo rellenos puntuales).
export const ICON_PATHS: Record<IconName, ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </>
  ),
  wind: (
    <>
      <path d="M17.7 7.7A2.5 2.5 0 1 1 19 12H3" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H3" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H3" />
    </>
  ),
  shield: <path d="M12 3c2.4 1.5 4.7 2.3 7 2.6v5.6c0 4.7-2.9 8.3-7 9.8-4.1-1.5-7-5.1-7-9.8V5.6c2.3-.3 4.6-1.1 7-2.6Z" />,
  heart: <path d="M12 20.5 4.9 13.4C3.7 12.2 3 10.7 3 9.2 3 6.4 5.2 4.2 8 4.2c1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1 2.8 0 5 2.2 5 5 0 1.5-.7 3-1.9 4.2L12 20.5Z" />,
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  book: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z" />
    </>
  ),
  medal: <><circle cx="12" cy="15" r="5" /><path d="M8.7 11.2 6 3h4.2l1.8 4.7L13.8 3H18l-2.7 8.2" /></>,
  telescope: (
    <>
      <path d="M3.7 13l13-5.8 1.6 3.6-13 5.8Z" />
      <path d="M13.8 8.5l1.6 3.6M17.9 6.2l1.9 4.4M11 14.5V16M7.5 19l3.5-3.5 3.5 3.5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  bulb: <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" /><path d="M9 18h6M10 21h4" /></>,
  sprout: (
    <>
      <path d="M12 21V11" />
      <path d="M12 13C12 9.1 9.1 6.5 5 6.5c0 3.9 2.9 6.5 7 6.5Z" />
      <path d="M12 11c0-3.9 2.9-6.5 7-6.5 0 3.9-2.9 6.5-7 6.5Z" />
      <path d="M7 21h10" />
    </>
  ),
  leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>,
  check: <path d="M4.5 12.5l5 5L19.5 6.5" />,
  flask: <><path d="M8.5 3h7" /><path d="M10 3v5.4L4.9 16.9A2.3 2.3 0 0 0 6.9 20.5h10.2a2.3 2.3 0 0 0 2-3.6L14 8.4V3" /><path d="M6.4 14.5h11.2" /></>,
  sparkle: <path d="M12 3Q13 10 21 12Q13 14 12 21Q11 14 3 12Q11 10 12 3Z" />,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M16 8l-2.3 5.7L8 16l2.3-5.7L16 8Z" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14.5v2" /></>,
  graduation: <><path d="M2 9.5 12 5l10 4.5-10 4.5L2 9.5Z" /><path d="M6.5 11.8v4c0 1.5 2.5 2.7 5.5 2.7s5.5-1.2 5.5-2.7v-4" /><path d="M22 9.5V15" /></>,
  crown: <><path d="M4.5 16.5 3.5 8l4.6 3.4L12 5.5l3.9 5.9L20.5 8l-1 8.5h-15Z" /><path d="M5 20h14" /></>,
  'chevron-up': <path d="M6 15l6-6 6 6" />,
  dot: <circle cx="12" cy="12" r="6" fill="currentColor" stroke="none" />,
  moon: (
    <>
      <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" fill="currentColor" stroke="none" />
      <path d="M18 4.5v2M17 5.5h2" />
    </>
  ),
  'nav-map': <><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" /><path d="M9 4v14M15 6v14" /></>,
  'nav-passport': <><rect x="5" y="3" width="14" height="18" rx="2.5" /><circle cx="12" cy="10" r="3" /><path d="M8.5 16.5h7" /></>,
  'nav-diary': <><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" /><path d="M8.5 4v16M12 8.5h4M12 12h4" /></>,
  'nav-help': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1.2-1.5 2.3" />
      <circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  'evidence-e3': <circle cx="12" cy="12" r="7" fill="currentColor" stroke="none" />,
  'evidence-e2': <><circle cx="12" cy="12" r="7" /><path d="M12 5a7 7 0 0 0 0 14Z" fill="currentColor" stroke="none" /></>,
  'evidence-e1': <circle cx="12" cy="12" r="7" />,
  'mood-1': <><circle cx="12" cy="12" r="9" /><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" /><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" /><path d="M8.2 16.4c1.1-1.6 2.3-2.4 3.8-2.4s2.7.8 3.8 2.4" /></>,
  'mood-2': <><circle cx="12" cy="12" r="9" /><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" /><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" /><path d="M9 15.8c.9-.8 1.9-1.2 3-1.2s2.1.4 3 1.2" /></>,
  'mood-3': <><circle cx="12" cy="12" r="9" /><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" /><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" /><path d="M9 15h6" /></>,
  'mood-4': <><circle cx="12" cy="12" r="9" /><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" /><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" /><path d="M9 14.3c.9.9 1.9 1.4 3 1.4s2.1-.5 3-1.4" /></>,
  'mood-5': <><circle cx="12" cy="12" r="9" /><path d="M8 9.8c.5-.6 1.3-.6 1.8 0M14.2 9.8c.5-.6 1.3-.6 1.8 0" /><path d="M8.2 13.8c1 1.9 2.3 2.8 3.8 2.8s2.8-.9 3.8-2.8" /></>,
};
