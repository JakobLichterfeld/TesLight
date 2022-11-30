import { ReactComponent as Logo } from '../assets/logo.svg';

export const Loading = (): JSX.Element => (
  <div className="flex h-full items-center justify-center">
    <Logo className="h-64" />
  </div>
);
