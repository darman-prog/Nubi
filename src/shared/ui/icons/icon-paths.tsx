import type { ReactNode } from 'react';

export type IconName =
  | 'sun' | 'wind' | 'shield' | 'heart' | 'cloud' | 'book' | 'medal'
  | 'telescope' | 'close' | 'bulb' | 'sprout' | 'leaf' | 'check'
  | 'flask' | 'sparkle' | 'compass' | 'lock' | 'graduation' | 'crown'
  | 'chevron-up' | 'dot'
  | 'mood-1' | 'mood-2' | 'mood-3' | 'mood-4' | 'mood-5';

// Sistema: grid 24×24 · área viva 2–22 · stroke-width 2 (o 1.75)
// stroke-linecap/linejoin: round · fill: none (excepto `dot`).
// Simetría espejada alrededor de x=12 en todos los iconos simétricos.
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
  shield: (
    <path d="M12 3c2.4 1.5 4.7 2.3 7 2.6v5.6c0 4.7-2.9 8.3-7 9.8-4.1-1.5-7-5.1-7-9.8V5.6c2.3-.3 4.6-1.1 7-2.6Z" />
  ),
  heart: (
    <path d="M12 20.5 4.9 13.4C3.7 12.2 3 10.7 3 9.2 3 6.4 5.2 4.2 8 4.2c1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1 2.8 0 5 2.2 5 5 0 1.5-.7 3-1.9 4.2L12 20.5Z" />
  ),
  cloud: (
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  ),
  book: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="15" r="5" />
      <path d="M8.7 11.2 6 3h4.2l1.8 4.7L13.8 3H18l-2.7 8.2" />
    </>
  ),
  telescope: (
    <>
      <path d="M3.7 13l13-5.8 1.6 3.6-13 5.8Z" />
      <path d="M13.8 8.5l1.6 3.6" />
      <path d="M17.9 6.2l1.9 4.4" />
      <path d="M11 14.5V16" />
      <path d="M7.5 19l3.5-3.5 3.5 3.5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  bulb: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6M10 21h4" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21V11" />
      <path d="M12 13C12 9.1 9.1 6.5 5 6.5c0 3.9 2.9 6.5 7 6.5Z" />
      <path d="M12 11c0-3.9 2.9-6.5 7-6.5 0 3.9-2.9 6.5-7 6.5Z" />
      <path d="M7 21h10" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5L19.5 6.5" />,
  flask: (
    <>
      <path d="M8.5 3h7" />
      <path d="M10 3v5.4L4.9 16.9A2.3 2.3 0 0 0 6.9 20.5h10.2a2.3 2.3 0 0 0 2-3.6L14 8.4V3" />
      <path d="M6.4 14.5h11.2" />
    </>
  ),
  sparkle: (
    <path d="M12 3Q13 10 21 12Q13 14 12 21Q11 14 3 12Q11 10 12 3Z" />
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8l-2.3 5.7L8 16l2.3-5.7L16 8Z" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14.5v2" />
    </>
  ),
  graduation: (
    <>
      <path d="M2 9.5 12 5l10 4.5-10 4.5L2 9.5Z" />
      <path d="M6.5 11.8v4c0 1.5 2.5 2.7 5.5 2.7s5.5-1.2 5.5-2.7v-4" />
      <path d="M22 9.5V15" />
    </>
  ),
  crown: (
    <>
      <path d="M4.5 16.5 3.5 8l4.6 3.4L12 5.5l3.9 5.9L20.5 8l-1 8.5h-15Z" />
      <path d="M5 20h14" />
    </>
  ),
  'chevron-up': <path d="M6 15l6-6 6 6" />,
  dot: <circle cx="12" cy="12" r="6" fill="currentColor" stroke="none" />,
  'mood-1': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5h.01M15 9.5h.01" />
      <path d="M8.5 16.5c1-1.6 2.2-2.4 3.5-2.4s2.5.8 3.5 2.4" />
    </>
  ),
  'mood-2': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5h.01M15 9.5h.01" />
      <path d="M9 16c.9-.9 1.9-1.3 3-1.3s2.1.4 3 1.3" />
    </>
  ),
  'mood-3': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5h.01M15 9.5h.01" />
      <path d="M9 15.5h6" />
    </>
  ),
  'mood-4': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5h.01M15 9.5h.01" />
      <path d="M9 14.5c.9.9 1.9 1.3 3 1.3s2.1-.4 3-1.3" />
    </>
  ),
  'mood-5': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5h.01M15 9.5h.01" />
      <path d="M8.5 14c1 1.7 2.2 2.5 3.5 2.5s2.5-.8 3.5-2.5" />
    </>
  ),
};