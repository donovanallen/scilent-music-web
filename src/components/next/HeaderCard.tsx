'use client';

import { Card, CardFooter, CardHeader } from '@nextui-org/card';
import { Image, Skeleton } from '@nextui-org/react';
// Import motion from framer-motion library
import React, { useState } from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

interface HeaderCardProps {
  title?: string;
  image?: string;
  name?: string;
  icon?: IconType;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  title,
  image,
  name,
  icon: Icon,
  onClick,
  className,
  disabled = false,
  children,
}) => {
  const [isCardLoaded, setIsCardLoaded] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  return (
    <Skeleton className='rounded-lg bg-neutral-500' isLoaded={isCardLoaded}>
      <Card
        isFooterBlurred
        radius='lg'
        classNames={{
          base: cn(
            'max-h-[180px] w-full overflow-hidden transition relative',
            // 'border-dark dark:border-light border',
            'hover:shadow-lg hover:border hover:border-brand-dark dark:hover:border-brand-primary',
            disabled ? 'opacity-30' : '',
            className,
          ),
          header: 'absolute z-10 top-1 flex-col items-start w-10/12',
          body: '',
          footer: cn(
            'absolute z-10 bottom-0 bg-black/40 border-t-1 border-default-600 dark:border-default-100 transition',
            // !showFooter ? 'hidden' : '',
            // 'border w-auto flex-col self-center justify-between before:bg-white/10 border-white/20 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 shadow-small ml-1 z-10 text-brand-dark',
          ),
        }}
        isHoverable // update to if children
        // onMouseOver={() => setShowFooter(!showFooter)}
        isPressable={!!onClick}
        onLoad={() => setIsCardLoaded(true)}
      >
        <CardHeader onClick={onClick}>
          {Icon && <Icon size={36} />}
          <h4 className='subtitle text-xs lg:text-sm line-clamp-1 text-dark/50 dark:text-light/50'>
            {title}
          </h4>
          <h3 className='text-brand-dark font-semibold line-clamp-1'>{name}</h3>
        </CardHeader>
        <Image
          removeWrapper
          alt='Card Image'
          className='z-0 w-full h-full object-cover object-center overflow-hidden aspect-square opacity-50 bg-opacity-50 semi-opaque-bg'
          src={image}
        />
        {children && <CardFooter>{children}</CardFooter>}
      </Card>
    </Skeleton>
  );
};

export default HeaderCard;
