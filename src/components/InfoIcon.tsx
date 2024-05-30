import React from 'react';
import { IconType } from 'react-icons';
import { PiInfo } from 'react-icons/pi';

import { cn } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';

type InfoIconProps = {
  icon?: IconType;
  onHover?: () => void;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

const InfoIcon: React.FC<InfoIconProps> = ({
  icon = PiInfo,
  onHover,
  onClick,
  className,
  children,
}) => {
  return (
    <IconButton
      className={cn(className)}
      classNames={{ icon: 'text-neutral-600 hover:text-light' }}
      icon={icon}
      onMouseOver={onHover}
      onClick={onClick}
      variant='ghost'
    >
      {children}
    </IconButton>
  );
};

export default InfoIcon;