import { version } from '../../package.json';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { Animation, Menu, MenuItem } from '../components';
import { keyToWord, toPercentage } from '../libs';
import { useLed } from './api';

export const Home = (): JSX.Element => {
  const { data } = useLed();

  return (
    <>
      <h1 className="text-3xl">TesLight</h1>
      <h2 className="text-base text-zinc">v{version}</h2>
      <Logo className="h-64 py-12" />
      {[
        MenuItem.Dashboard,
        MenuItem.CenterConsole,
        MenuItem.FrontLeftDoor,
        MenuItem.FrontRightDoor,
        MenuItem.RearLeftDoor,
        MenuItem.RearRightDoor,
        MenuItem.LeftFootwell,
        MenuItem.RightFootwell,
      ].map((zone) => (
        <Menu
          key={`zone-${zone}`}
          name={zone}
          brightness={toPercentage(data?.[zone].brightness ?? 0)}
          animation={keyToWord(Animation[data?.[zone].type ?? 0])}
        />
      ))}
      <Menu name={MenuItem.Settings} />
      <Menu name={MenuItem.LogFiles} />
    </>
  );
};
