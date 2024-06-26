import { Chip } from '@nextui-org/react';
import React from 'react';

import { cn } from '@/lib/utils';

type NextPillProps = {
  text: string;
  className?: string;
  classNames?: { base?: string; content?: string };
  variant?:
    | 'solid'
    | 'bordered'
    | 'light'
    | 'flat'
    | 'faded'
    | 'shadow'
    | 'dot';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  disabled?: boolean;
};

const NextPill: React.FC<NextPillProps> = ({
  text,
  className,
  classNames,
  variant,
  disabled = false,
  size = 'md',
  radius = 'md',
}) => {
  return (
    <Chip
      size={size}
      variant={variant}
      radius={radius}
      isDisabled={disabled}
      className={cn(className)}
      classNames={{
        base: cn(
          'z-10 bg-opacity-90',
          classNames?.base,
          variant === 'bordered' ? 'border' : '',
        ),
        content: cn(
          'drop-shadow shadow-black subtitle font-thin text-2xs lg:text-xs line-clamp-1',
          classNames?.content,
        ),
      }}
    >
      {text}
    </Chip>
  );
};

export default NextPill;
