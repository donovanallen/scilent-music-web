import React from 'react';

import { cn } from '@/lib/utils';

import { NavigationBar } from '@/components/NavigationBar';

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
}

const Header: React.FC<HeaderProps> = ({
  title,
  children,
  className,
  style,
}) => {
  return (
    <div
      style={style}
      className={cn(
        'h-fit py-6',
        'flex flex-col w-full sticky top-0 z-10',
        'border-b-2 border-b-dark dark:border-b-brand-dark',
        className,
      )}
    >
      <NavigationBar />

      {title && (
        <h1 className='text-brand-dark dark:text-light line-clamp-1 text-2xl sm:text-3xl md:h1 px-6'>
          {title}
        </h1>
      )}
      {children}
    </div>
  );
};

export default Header;
