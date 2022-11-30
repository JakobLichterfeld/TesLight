import {
  AdjustmentsVerticalIcon,
  ChevronRightIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Link } from '@tanstack/react-location';
import { ReactComponent as CenterConsoleIcon } from '../assets/center-console.svg';
import { ReactComponent as DashboardIcon } from '../assets/dashboard.svg';
import { ReactComponent as DoorIcon } from '../assets/door.svg';

export enum MenuItem {
  Dashboard,
  CenterConsole,
  FrontLeftDoor,
  FrontRightDoor,
  RearLeftDoor,
  RearRightDoor,
  LeftFootwell,
  RightFootwell,
  Settings,
  LogFiles,
}

export const MENU_CONFIG: {
  [key in MenuItem]: {
    name: string;
    icon: React.ReactElement;
    path: string;
  };
} = {
  [MenuItem.Dashboard]: {
    name: 'Dashboard',
    icon: <DashboardIcon className="h-8 w-8" />,
    path: 'dashboard',
  },
  [MenuItem.CenterConsole]: {
    name: 'Center Console',
    icon: <CenterConsoleIcon className="h-8 w-8" />,
    path: 'center-console',
  },
  [MenuItem.FrontLeftDoor]: {
    name: 'Front Left Door',
    icon: <DoorIcon className="h-8 w-8 -scale-x-100" />,
    path: 'fl-door',
  },
  [MenuItem.FrontRightDoor]: {
    name: 'Front Right Door',
    icon: <DoorIcon className="h-8 w-8" />,
    path: 'fr-door',
  },
  [MenuItem.RearLeftDoor]: {
    name: 'Rear Left Door',
    icon: <DoorIcon className="h-8 w-8 -scale-x-100" />,
    path: 'rl-door',
  },
  [MenuItem.RearRightDoor]: {
    name: 'Rear Right Door',
    icon: <DoorIcon className="h-8 w-8" />,
    path: 'rr-door',
  },
  [MenuItem.LeftFootwell]: {
    name: 'Left Footwell',
    icon: <DoorIcon className="h-8 w-8 -scale-x-100" />,
    path: 'l-footwell',
  },
  [MenuItem.RightFootwell]: {
    name: 'Right Footwell',
    icon: <DoorIcon className="h-8 w-8" />,
    path: 'r-footwell',
  },
  [MenuItem.Settings]: {
    name: 'Settings',
    icon: <AdjustmentsVerticalIcon className="h-6 w-6" />,
    path: 'settings',
  },
  [MenuItem.LogFiles]: {
    name: 'Log Files',
    icon: <DocumentTextIcon className="h-6 w-6" />,
    path: 'log-files',
  },
};

type MenuProps = {
  name: MenuItem;
  brightness?: number;
  animation?: string;
};

export const Menu = ({
  name,
  brightness,
  animation,
}: MenuProps): JSX.Element => {
  const config = MENU_CONFIG[name];

  return (
    <Link to={config.path}>
      <div className="my-6 flex flex-row">
        <div className="w-12 flex-none self-center">{config.icon}</div>
        <div className="grow">
          <p>{config.name}</p>
          {!!animation && !!brightness && (
            <p className="text-xs">
              {animation}{' '}
              <span className="text-zinc">&bull; Brightness {brightness}%</span>
            </p>
          )}
        </div>
        <div className="w-6 flex-none self-center text-right text-zinc">
          <ChevronRightIcon className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};
