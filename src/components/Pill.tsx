import { Chip } from '@nextui-org/react';
import React from 'react';

import { cn } from '@/lib/utils';

type NextPillProps = {
  text: string;
  className?: string;
  children?: React.ReactNode;
  variant?:
    | 'solid'
    | 'bordered'
    | 'light'
    | 'flat'
    | 'faded'
    | 'shadow'
    | 'dot';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
};

const NextPill: React.FC<NextPillProps> = ({
  text,
  className,
  children,
  variant,
  disabled = false,
  size,
}) => {
  return (
    <Chip
      size={size}
      variant={variant}
      radius='lg'
      isDisabled={disabled}
      className={cn(className)}
      color='primary'
      classNames={{
        base: 'z-10 bg-opacity-90',
        content:
          'drop-shadow shadow-black text-white subtitle font-thin text-2xs lg:text-xs line-clamp-1',
      }}
    >
      {text}
    </Chip>
  );
};

export default NextPill;
