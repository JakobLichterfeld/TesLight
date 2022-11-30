import { Header, MenuItem, Zone } from '../components';

const CENTER_CONSOLE = MenuItem.CenterConsole;

export const CenterConsole = (): JSX.Element => (
  <>
    <Header name={CENTER_CONSOLE} />
    <Zone name={CENTER_CONSOLE} />
  </>
);
