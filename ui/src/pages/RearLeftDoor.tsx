import { Header, MenuItem, Zone } from '../components';

const RIGHT_LEFT_DOOR = MenuItem.RearLeftDoor;

export const RearLeftDoor = (): JSX.Element => (
  <>
    <Header name={RIGHT_LEFT_DOOR} />
    <Zone name={RIGHT_LEFT_DOOR} />
  </>
);
