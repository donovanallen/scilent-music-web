import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

type SidebarItemProps = {
  icon?: IconType;
  label: string;
  active?: boolean;
  href: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        `flex flex-row h-auto items-center w-full gap-x-4 cursor-pointer hover:text-brand-primary transition text-light py-1`,
        active && 'text-brand-dark',
      )}
    >
      {Icon && <Icon size={26} />}
      <h4 className='truncate w-100'>{label}</h4>
    </Link>
  );
};

export default SidebarItem;
