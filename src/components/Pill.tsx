import React from 'react';

import { cn } from '@/lib/utils';

type PillProps = {
  text: string;
  className?: string;
  children?: React.ReactNode;
};

const Pill: React.FC<PillProps> = ({ text, className, children }) => {
  return (
    <div
      className={cn(
        'border border-light rounded-sm px-2 py-1 w-fit overflow-clip',
        className,
      )}
    >
      <p className='subtitle text-light text-xs truncate'>{text}</p>
      {children}
    </div>
  );
};

export default Pill;
