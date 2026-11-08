import { fechaLocal } from './user-state';
import type { Stage, UserStateV1 } from './user-state';
import type { UserStateStore } from './user-state-store';

type IslandProgress = UserStateV1['progress']['islands'][string];

const emptyIsland = (): IslandProgress => ({
  stages: { llegada: false, historia: false, retos: false, sello: false },
  sourcesOpened: [],
  mechanicsDone: [],
});

const withIsland = (
  state: UserStateV1,
  islandId: string,
  change: (current: IslandProgress) => IslandProgress,
): UserStateV1 => {
  const current = state.progress.islands[islandId] ?? emptyIsland();
  return {
    ...state,
    progress: {
      ...state.progress,
      islands: {
        ...state.progress.islands,
        [islandId]: { ...current, visitedAt: current.visitedAt ?? fechaLocal(), ...change(current) },
      },
    },
  };
};

export const markStage = (store: UserStateStore, islandId: string, stage: Stage): void => {
  store.update((state) => {
    if (state.progress.islands[islandId]?.stages[stage]) return state;
    return withIsland(state, islandId, (current) => ({
      ...current,
      stages: { ...current.stages, [stage]: true },
    }));
  });
};

export const markSourceOpened = (store: UserStateStore, islandId: string, evidenceId: string): void => {
  store.update((state) => {
    const current = state.progress.islands[islandId] ?? emptyIsland();
    if (current.sourcesOpened.includes(evidenceId)) return state;
    return withIsland(state, islandId, (item) => ({
      ...item,
      sourcesOpened: [...item.sourcesOpened, evidenceId],
    }));
  });
};

export const markMechanic = (store: UserStateStore, islandId: string, mechanicId: string): void => {
  store.update((state) => {
    const current = state.progress.islands[islandId] ?? emptyIsland();
    if (current.mechanicsDone.includes(mechanicId)) return state;
    return withIsland(state, islandId, (item) => ({
      ...item,
      mechanicsDone: [...item.mechanicsDone, mechanicId],
    }));
  });
};

export const markChainSolved = (store: UserStateStore, chainId: string): void => {
  store.update((state) => {
    if (state.progress.chains.some((chain) => chain.chainId === chainId)) return state;
    return {
      ...state,
      progress: {
        ...state.progress,
        chains: [...state.progress.chains, { chainId, solvedAt: fechaLocal() }],
      },
    };
  });
};
