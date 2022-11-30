import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Link } from '@tanstack/react-location';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { MenuItem, MENU_CONFIG } from './Menu';

type HeaderProps = { name: MenuItem } & React.HTMLAttributes<HTMLDivElement>;

export const Header = ({
  name,
  className,
  ...props
}: HeaderProps): JSX.Element => {
  const config = MENU_CONFIG[name];

  return (
    <div
      className={twMerge('flex flex-col justify-center', className)}
      {...props}
    >
      <div className="mb-12 flex flex-row">
        <div className="w-8 flex-none self-center">
          <Link to="/">
            <ChevronLeftIcon className="my-1 h-6 w-6" />
          </Link>
        </div>
        <div className="grow text-center">
          <h1 className="mr-8 text-3xl">{config.name}</h1>
        </div>
      </div>
      {![MenuItem.Settings, MenuItem.LogFiles].includes(name) && (
        <div className="mb-12">
          {React.cloneElement(config.icon, {
            className: twMerge(
              config.icon.props.className,
              'mx-auto h-auto w-64',
            ),
          })}
        </div>
      )}
    </div>
  );
};
