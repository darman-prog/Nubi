import type { ReactNode } from 'react';

export type IconName =
  | 'sun'
  | 'wind'
  | 'shield'
  | 'heart'
  | 'cloud'
  | 'book'
  | 'medal'
  | 'telescope'
  | 'close'
  | 'bulb'
  | 'sprout'
  | 'leaf'
  | 'check'
  | 'flask'
  | 'sparkle'
  | 'compass'
  | 'lock'
  | 'graduation'
  | 'crown'
  | 'chevron-up'
  | 'dot'
  | 'mood-1'
  | 'mood-2'
  | 'mood-3'
  | 'mood-4'
  | 'mood-5';

// Geometría en grid 24x24 con trazo redondeado coherente con la navegación principal.
export const ICON_PATHS: Record<IconName, ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  wind: (
    <>
      <path d="M17.7 7.7A2.5 2.5 0 1 1 19 12H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 5-3.2 8.7-7 10-3.8-1.3-7-5-7-10V6l7-3Z" />,
  heart: (
    <path d="M12 20.5s-7-4.5-8.5-9.2C2.4 7.8 4.8 4.5 8.2 4.5c1.8 0 3.1.9 3.8 2.1.7-1.2 2-2.1 3.8-2.1 3.4 0 5.8 3.3 4.7 6.8C19 16 12 20.5 12 20.5Z" />
  ),
  cloud: (
    <path d="M17.5 18H7a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17.2 8.8 3.5 3.5 0 0 1 17.5 18Z" />
  ),
  book: (
    <>
      <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H12v17H4.5A2.5 2.5 0 0 0 2 22V5.5Z" />
      <path d="M22 5.5A2.5 2.5 0 0 0 19.5 3H12v17h7.5A2.5 2.5 0 0 1 22 22V5.5Z" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="14" r="5.5" />
      <path d="M8.5 3h7l-2 5.5h-3L8.5 3Z" />
    </>
  ),
  telescope: (
    <>
      <path d="M4 13l13-6 2.5 5-13 6L4 13Z" />
      <path d="M11 15l-3 6M13 14l3 7M12 14.5V21" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M8.5 14.5c-1.5-1.1-2.5-2.8-2.5-4.8a6 6 0 1 1 12 0c0 2-1 3.7-2.5 4.8-.6.5-1 1.2-1 2H9.5c0-.8-.4-1.5-1-2Z" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 14c-4.5 0-7-2.5-7-6.5 4.5 0 7 2.5 7 6.5Z" />
      <path d="M12 12c0-4.5 2.5-7 7-7 0 4.5-2.5 7-7 7Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M19 4C10 4 5 9 5 17c8 0 14-5 14-13Z" />
      <path d="M5 19l8-8" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  flask: (
    <>
      <path d="M9 3h6M10 3v5.2l-4.7 8.4A2 2 0 0 0 7 19.5h10a2 2 0 0 0 1.7-2.9L14 8.2V3" />
      <path d="M7.5 14.5h9" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6-5.6-1.9 5.6-1.9L12 3Z" />
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.5 8.5 13.4 13.4 8.5 15.5 10.6 10.6 15.5 8.5" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  graduation: (
    <>
      <path d="M2 10l10-5 10 5-10 5-10-5Z" />
      <path d="M6 12v4.5c0 1.7 2.7 3 6 3s6-1.3 6-3V12M20 11v5" />
    </>
  ),
  crown: (
    <path d="M3 18h18l-1.5-9-4.5 4-3-6-3 6-4.5-4L3 18Z" />
  ),
  'chevron-up': <path d="M6 14.5l6-6 6 6" />,
  dot: <circle cx="12" cy="12" r="6" fill="currentColor" stroke="none" />,
  'mood-1': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 10h.01M15 10h.01M8.5 16.5c1-1.5 2.2-2 3.5-2s2.5.5 3.5 2" />
    </>
  ),
  'mood-2': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 10h.01M15 10h.01M9 16c1-.8 2-1.2 3-1.2s2 .4 3 1.2" />
    </>
  ),
  'mood-3': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 10h.01M15 10h.01M9 15h6" />
    </>
  ),
  'mood-4': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 10h.01M15 10h.01M9 14.5c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5" />
    </>
  ),
  'mood-5': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 10h.01M15 10h.01M8 14c1 2 2.4 3 4 3s3-1 4-3" />
    </>
  ),
};
