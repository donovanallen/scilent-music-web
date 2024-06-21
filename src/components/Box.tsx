import React from 'react';

import { cn } from '@/lib/utils';

type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        `rounded-lg h-fit w-full`,
        'bg-light dark:bg-dark',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Box;
