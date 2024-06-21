'use client';

import { Tooltip } from '@nextui-org/react';
import { useMediaQuery } from '@uidotdev/usehooks';
import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

type SidebarItemProps = {
  icon?: IconType;
  label: string;
  active?: boolean;
  href: string;
  disabled?: boolean;
  pill?: React.ReactNode;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
  disabled = false,
  pill,
}) => {
  const isMediumDevice = useMediaQuery('only screen and (min-width : 769px)');

  return (
    <Tooltip
      content={label}
      key={label}
      shadow='md'
      size='lg'
      classNames={{
        content: cn(
          'h4 text-brand-dark bg-light dark:text-brand-primary dark:bg-dark',
          active && 'font-medium',
        ),
      }}
      placement='right'
      isDisabled={isMediumDevice}
    >
      <Link
        href={href}
        className={cn(
          'flex flex-row h-auto items-center w-full md:gap-x-4 py-1 cursor-pointer transition',
          'text-dark dark:text-light',
          'hover:text-brand-dark dark:hover:text-brand-primary/80',
          active && 'text-brand-dark dark:text-brand-dark',
          disabled && 'text-dark/60 dark:text-light/60 cursor-not-allowed',
        )}
        aria-disabled={disabled}
      >
        {Icon && <Icon size={26} />}
        <div className='hidden md:flex items-center w-100 gap-x-2'>
          <h4 className={cn('truncate', active && 'font-medium')}>{label}</h4>
          {pill}
        </div>
      </Link>
    </Tooltip>
  );
};

export default SidebarItem;
