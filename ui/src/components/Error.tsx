import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { version } from '../../package.json';
import { Log } from './Log';

type ErrorProps = { error?: Error };

export const Error = ({ error }: ErrorProps): JSX.Element => (
  <>
    <h1 className="text-3xl">TesLight</h1>
    <h2 className="text-base text-zinc">v{version}</h2>
    <div className="mt-12 flex flex-col items-center">
      <ExclamationCircleIcon className="mb-2 h-12 w-12 text-red-700" />
      <h3 className="text-2xl">Oops!</h3>
      <h4 className="text-xl">Something went wrong.</h4>
      {error?.message && <Log className="mt-6">{error.message}</Log>}
    </div>
  </>
);
