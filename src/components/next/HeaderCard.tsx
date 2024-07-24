'use client';

import { Card, CardFooter, CardHeader } from '@nextui-org/card';
import { Image, Skeleton } from '@nextui-org/react';
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
        classNames={{
          base: cn(
            'max-h-[180px] w-full transition',
            'z-30 bg-clip-text',
            'hover:shadow-lg hover:border hover:border-brand-dark dark:hover:border-brand-primary',
            disabled ? 'opacity-30' : '',
            className,
          ),
          header:
            'absolute z-10 top-0 flex-col items-start w-full h-full semi-opaque-bg',
          body: 'border border-green-400',
          footer: cn(
            'absolute z-10 bottom-0 bg-black/40 border-t-1 border-default-600 dark:border-default-100 transition',
          ),
        }}
        radius='lg'
        isFooterBlurred
        isBlurred
        isHoverable
        isPressable={!!onClick}
        onLoad={() => setIsCardLoaded(true)}
        onPress={onClick}
      >
        <Image
          removeWrapper
          alt='Card Image'
          className='z-10 w-full h-full object-cover object-center overflow-hidden aspect-square'
          src={image}
          isZoomed
          shadow='md'
        />
        <CardHeader>
          {Icon && <Icon size={36} />}
          <h4 className='subtitle text-xs lg:text-sm line-clamp-1 text-dark/50 dark:text-light/50'>
            {title}
          </h4>
          <h4 className='text-brand-primary font-medium line-clamp-1'>
            {name}
          </h4>
        </CardHeader>
        {children && <CardFooter>{children}</CardFooter>}
      </Card>
    </Skeleton>
  );
};

export default HeaderCard;
