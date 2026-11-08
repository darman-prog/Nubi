import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ImmersiveLayout } from './layouts/ImmersiveLayout';
import { MapLayout } from './layouts/MapLayout';
import { PageLayout } from './layouts/PageLayout';
import { NotFoundScreen } from './NotFoundScreen';

const HomeScreen = lazy(() => import('@/features/home/HomeScreen'));
const PassportSheet = lazy(() => import('@/features/passport/PassportSheet'));
const IslandSheet = lazy(() => import('@/features/island/IslandSheet'));
const DiaryScreen = lazy(() => import('@/features/diary/DiaryScreen'));
const HelpScreen = lazy(() => import('@/features/help/HelpScreen'));
const CoronationScreen = lazy(() => import('@/features/coronation/CoronationScreen'));

/** Contrato de rutas de ADR-015: mapa, pasaporte e isla comparten MapLayout. */
export function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />

      <Route element={<MapLayout />}>
        <Route path="/mapa" element={null} />
        <Route path="/pasaporte" element={<PassportSheet />} />
        <Route path="/isla/:slug" element={<IslandSheet />} />
        <Route path="/isla/:slug/:etapa" element={<IslandSheet />} />
      </Route>

      <Route element={<PageLayout />}>
        <Route path="/diario" element={<DiaryScreen />} />
        <Route path="/ayuda" element={<HelpScreen />} />
      </Route>

      <Route element={<ImmersiveLayout />}>
        <Route path="/coronacion" element={<CoronationScreen />} />
      </Route>

      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}
