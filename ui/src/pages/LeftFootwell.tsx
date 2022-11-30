import { Header, MenuItem, Zone } from '../components';

const LEFT_FOOTWELL = MenuItem.LeftFootwell;

export const LeftFootwell = (): JSX.Element => (
  <>
    <Header name={LEFT_FOOTWELL} />
    <Zone name={LEFT_FOOTWELL} />
  </>
);
