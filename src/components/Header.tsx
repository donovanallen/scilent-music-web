import React from 'react';

import { cn } from '@/lib/utils';

import NavigationBar from '@/components/NavigationBar';

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, children, className }) => {
  return (
    <div className={cn(`h-fit p-6 border-b-2 border-b-brand-dark`, className)}>
      <NavigationBar />
      {title && <h1 className='text-brand-light'>{title}</h1>}
      {children}
    </div>
  );
};

export default Header;
