'use client';

import { useEffect, useState } from 'react';

import { cn } from '../lib/utils';

import Logo from '~/svg/Logo_Full_Gray.svg';

const ScilentLogo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Logo
      className={cn(
        'w-1/2 transition-opacity duration-1000 ease-in',
        isVisible ? 'opacity-100' : 'opacity-0',
      )}
    />
  );
};

export default ScilentLogo;
