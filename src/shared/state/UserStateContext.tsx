import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import type { UserStateStore } from '@/core/user-state-store';
import type { UserStateV1 } from '@/core/user-state';

const UserStateContext = createContext<UserStateStore | null>(null);

interface UserStateProviderProps {
  store: UserStateStore;
  children: ReactNode;
}

/** Inyecta el store en el árbol React; único contexto de la aplicación. */
export function UserStateProvider({ store, children }: UserStateProviderProps): React.JSX.Element {
  return <UserStateContext.Provider value={store}>{children}</UserStateContext.Provider>;
}

export function useUserStateStore(): UserStateStore {
  const store = useContext(UserStateContext);
  if (!store) throw new Error('useUserStateStore necesita un UserStateProvider.');
  return store;
}

/** Suscribe el componente al estado completo del viaje. */
export function useUserState(): UserStateV1 {
  const store = useUserStateStore();
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
