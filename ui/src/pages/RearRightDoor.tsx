import { Header, MenuItem, Zone } from '../components';

const REAR_RIGHT_DOOR = MenuItem.RearRightDoor;

export const RearRightDoor = (): JSX.Element => (
  <>
    <Header name={REAR_RIGHT_DOOR} />
    <Zone name={REAR_RIGHT_DOOR} />
  </>
);
