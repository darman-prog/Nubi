import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AtmosphericSky } from './AtmosphericSky';

describe('AtmosphericSky', () => {
  it('renderiza el cielo decorativo como aria-hidden en variantes map y page', () => {
    const { container, rerender } = render(<AtmosphericSky variant="map" />);
    const mapSky = container.querySelector('[data-sky-variant="map"]');
    expect(mapSky).toHaveAttribute('aria-hidden', 'true');

    rerender(<AtmosphericSky variant="page" />);
    const pageSky = container.querySelector('[data-sky-variant="page"]');
    expect(pageSky).toHaveAttribute('aria-hidden', 'true');
  });
});
