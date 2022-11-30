import { Header, MenuItem, Zone } from '../components';

const FRONT_LEFT_DOOR = MenuItem.FrontLeftDoor;

export const FrontLeftDoor = (): JSX.Element => (
  <>
    <Header name={FRONT_LEFT_DOOR} />
    <Zone name={FRONT_LEFT_DOOR} />
  </>
);
