'use client';

import React from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

interface HeaderItemProps {
  title?: string;
  image?: string;
  name?: string;
  icon?: IconType;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const HeaderItem: React.FC<HeaderItemProps> = ({
  title,
  image,
  name,
  icon: Icon,
  onClick,
  className,
  disabled = false,
  children,
}) => {
  // Prepare background image style if image prop is provided
  const backgroundImageStyle = image
    ? { backgroundImage: `url(${image})` }
    : {};

  return (
    // TODO update to bg image
    <button
      onClick={onClick}
      className={cn(
        'relative group  min-h-36 rounded-lg w-full overflow-hidden transition bg-black border-white border',
        'bg-cover bg-center', // Background size and position
        'semi-opaque-bg', // Custom class for semi-opaque background

        disabled ? 'opacity-30 cursor-not-allowed' : '',
        className,
      )}
      style={backgroundImageStyle}
    >
      <div
        className={cn('flex flex-col justify-end w-full gap-y-2 px-4 h-full')}
      >
        <h2 className='truncate text-lg lg:text-2xl xl:text-3xl'>{name}</h2>
        <div className='flex flex-col gap-y-1 w-full items-center self-center text-brand-dark'>
          <h4 className='subtitle text-xs lg:text-sm'>{title}</h4>
          {Icon && <Icon size={20} className='' />}
        </div>
      </div>
      {children}
    </button>
  );
};

export default HeaderItem;
