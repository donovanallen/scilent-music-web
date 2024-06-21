import { Chip } from '@nextui-org/react';
import React from 'react';

import { cn } from '@/lib/utils';

type StatusIndicatorProps = {
  text?: string;
  color?: 'success' | 'warning' | 'danger' | 'default';

  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  hideText?: boolean;

  className?: string;
  classNames?: { base?: string; content?: string; dot?: string };
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  text,
  className,
  classNames,
  disabled = false,
  loading = false,
  // hideText = false,
  size = 'sm',
  color = 'default',
}) => {
  return (
    <Chip
      size={size}
      variant='dot'
      radius='full'
      color={color}
      isDisabled={disabled}
      className={cn('border-none', className)}
      classNames={{
        base: cn('z-10', classNames?.base),
        content: cn(
          // 'drop-shadow shadow-black',
          classNames?.content,
          'subtitle font-thin text-2xs lg:text-xs line-clamp-1',
          text ? 'flex' : 'hidden',
        ),
        dot: cn('m-0', loading ? 'animate-ping' : '', classNames?.dot),
      }}
    >
      {text}
    </Chip>
  );
};

export default StatusIndicator;
