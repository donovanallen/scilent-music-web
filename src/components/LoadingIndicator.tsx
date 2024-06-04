'use client';

import { Progress } from '@nextui-org/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  label?: string;
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  label = 'Loading',
  className,
}) => {
  return (
    <Progress
      size='sm'
      color='primary'
      isIndeterminate
      aria-label='Loading...'
      className={cn(className)}
      classNames={{
        base: 'max-w-md',
        track: 'drop-shadow-md',
        indicator: 'bg-gradient-to-r from-brand-dark to-brand-primary',
        label: 'tracking-wider font-medium text-default-600',
        value: 'text-foreground/60',
      }}
    />
  );
};

export default LoadingIndicator;
