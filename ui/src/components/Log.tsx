import React from 'react';
import { twMerge } from 'tailwind-merge';

type LogProps = React.HTMLAttributes<HTMLPreElement>;

export const Log = ({
  className,
  children,
  ...props
}: LogProps): JSX.Element => (
  <pre
    className={twMerge(
      'w-full rounded-md bg-neutral p-3 text-xs dark:bg-gray',
      className,
    )}
    {...props}
  >
    {children}
  </pre>
);
