import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { content } from '@/core/content/content-repository';
import { StorageService } from '@/core/storage';
import { UserStateStore } from '@/core/user-state-store';
import { UserStateProvider } from '@/shared/state/UserStateContext';
import { StoryStage } from './StoryStage';

describe('StoryStage', () => {
  it('muestra la etiqueta legible del acto («Síntoma») y no el identificador crudo («sintoma»)', () => {
    const reloj = content.islandBySlug('reloj')!;
    const store = new UserStateStore(new StorageService(null, 0));

    render(
      <UserStateProvider store={store}>
        <StoryStage island={reloj} onFinish={vi.fn()} />
      </UserStateProvider>,
    );

    expect(screen.getByText('Síntoma')).toBeInTheDocument();
    expect(screen.queryByText('sintoma')).not.toBeInTheDocument();
  });

  it('muestra la etiqueta «Explicación simplificada» cuando la escena tiene isSimplified', () => {
    const cerebro = content.islandBySlug('cerebro')!;
    const store = new UserStateStore(new StorageService(null, 0));

    render(
      <UserStateProvider store={store}>
        <StoryStage island={cerebro} onFinish={vi.fn()} />
      </UserStateProvider>,
    );

    expect(screen.getByText('Explicación simplificada')).toBeInTheDocument();
  });
});
