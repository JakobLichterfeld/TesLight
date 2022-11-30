import { Header, MenuItem, Zone } from '../components';

const DASHBORD = MenuItem.Dashboard;

export const Dashboard = (): JSX.Element => (
  <>
    <Header name={DASHBORD} />
    <Zone name={DASHBORD} />
  </>
);
