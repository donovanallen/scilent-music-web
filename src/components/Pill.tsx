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
        'border border-light rounded-md px-2 py-1 w-fit overflow-clip',
        className,
      )}
    >
      <p className='font-thin subtitle text-2xs lg:text-xs md:truncate'>
        {text}
      </p>
      {children}
    </div>
  );
};

export default Pill;
