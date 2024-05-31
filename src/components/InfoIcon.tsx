import { Tooltip } from '@nextui-org/react';
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
  tooltipEnabled?: boolean;
  tooltip?: {
    content: string | React.ReactNode;
  };
};

const InfoIcon: React.FC<InfoIconProps> = ({
  icon = PiInfo,
  onHover,
  onClick,
  className,
  children,
  tooltipEnabled = false,
  tooltip,
}) => {
  return (
    <Tooltip
      isDisabled={!tooltipEnabled}
      shadow='md'
      size='md'
      content={tooltip?.content}
      classNames={{
        content: 'text-dark bg-light p-4',
        base: 'max-w-xs',
      }}
      delay={1000}
      showArrow
    >
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
    </Tooltip>
  );
};

export default InfoIcon;
