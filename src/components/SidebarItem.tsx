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
        content: 'text-brand-primary bg-dark h4',
      }}
      placement='right'
      isDisabled={isMediumDevice}
    >
      <Link
        href={href}
        className={cn(
          `flex flex-row h-auto items-center w-full md:gap-x-4 cursor-pointer hover:text-brand-primary transition text-light py-1`,
          active && 'text-brand-dark',
          disabled &&
            'text-neutral-700 cursor-not-allowed hover:text-neutral-600',
        )}
        aria-disabled={disabled}
      >
        {Icon && <Icon size={26} />}
        <div className='hidden md:flex items-center w-100 gap-x-2'>
          <h4 className='truncate'>{label}</h4>
          {pill}
        </div>
      </Link>
    </Tooltip>
  );
};

export default SidebarItem;
