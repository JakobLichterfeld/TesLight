import { Header, MenuItem, Zone } from '../components';

const RIGHT_FOOTWELL = MenuItem.RightFootwell;

export const RightFootwell = (): JSX.Element => (
  <>
    <Header name={RIGHT_FOOTWELL} />
    <Zone name={RIGHT_FOOTWELL} />
  </>
);
