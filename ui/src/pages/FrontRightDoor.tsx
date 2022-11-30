import { Header, MenuItem, Zone } from '../components';

const FRONT_RIGHT_DOOR = MenuItem.FrontRightDoor;

export const FrontRightDoor = (): JSX.Element => (
  <>
    <Header name={FRONT_RIGHT_DOOR} />
    <Zone name={FRONT_RIGHT_DOOR} />
  </>
);
