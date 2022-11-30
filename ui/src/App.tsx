import { Outlet, ReactLocation, Router } from '@tanstack/react-location';
import { Suspense } from 'react';
import { SWRConfig } from 'swr';
import {
  Error,
  ErrorBoundary,
  Loading,
  MenuItem,
  MENU_CONFIG,
} from './components';
import { fetcher } from './libs';
import {
  CenterConsole,
  Dashboard,
  FrontLeftDoor,
  FrontRightDoor,
  Home,
  LeftFootwell,
  LogFiles,
  RearLeftDoor,
  RearRightDoor,
  RightFootwell,
  Settings,
} from './pages';

const location = new ReactLocation();

const App = () => (
  <Router
    location={location}
    routes={[
      { path: '/', element: <Home /> },
      {
        path: MENU_CONFIG[MenuItem.Dashboard].path,
        element: <Dashboard />,
      },
      {
        path: MENU_CONFIG[MenuItem.CenterConsole].path,
        element: <CenterConsole />,
      },
      {
        path: MENU_CONFIG[MenuItem.FrontLeftDoor].path,
        element: <FrontLeftDoor />,
      },
      {
        path: MENU_CONFIG[MenuItem.FrontRightDoor].path,
        element: <FrontRightDoor />,
      },
      {
        path: MENU_CONFIG[MenuItem.RearLeftDoor].path,
        element: <RearLeftDoor />,
      },
      {
        path: MENU_CONFIG[MenuItem.RearRightDoor].path,
        element: <RearRightDoor />,
      },
      {
        path: MENU_CONFIG[MenuItem.LeftFootwell].path,
        element: <LeftFootwell />,
      },
      {
        path: MENU_CONFIG[MenuItem.RightFootwell].path,
        element: <RightFootwell />,
      },
      {
        path: MENU_CONFIG[MenuItem.Settings].path,
        element: <Settings />,
      },
      {
        path: MENU_CONFIG[MenuItem.LogFiles].path,
        element: <LogFiles />,
      },
    ]}
  >
    <div className=" bg-neutral text-slate dark:bg-slate dark:text-neutral">
      <div className="container mx-auto min-h-screen p-12">
        <ErrorBoundary fallback={<Error />}>
          <Suspense fallback={<Loading />}>
            <SWRConfig value={{ suspense: true, fetcher }}>
              <Outlet />
            </SWRConfig>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  </Router>
);

export default App;
