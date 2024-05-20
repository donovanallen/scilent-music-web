'use client';

import { Card, CardFooter } from '@nextui-org/card';
import { Image } from '@nextui-org/react';
import React from 'react';
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
  // Prepare background image style if image prop is provided
  const backgroundImageStyle = image
    ? { backgroundImage: `url(${image})` }
    : {};

  return (
    <Card
      isFooterBlurred
      radius='lg'
      className={cn(
        'border',
        'relative group min-h-36 max-h-50 rounded-lg w-full overflow-hidden transition',
      )}
      isPressable={!!onClick}
      onPress={onClick}
    >
      <Image
        alt='Card Image'
        className='border object-cover object-center overflow-hidden aspect-square'
        radius='lg'
        // height={200}
        src={image}
        // width={200}
      />
      {/* <CardHeader></CardHeader> */}
      {/* <CardBody>
        <h2 className='text-lg lg:text-2xl xl:text-3xl line-clamp-1'>{name}</h2>
      </CardBody> */}
      <CardFooter className='border w-auto flex-col self-center justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 shadow-small ml-1 z-10 text-brand-dark'>
        <h4 className='subtitle text-xs lg:text-sm line-clamp-1'>{title}</h4>
        {Icon && <Icon size={20} />}
      </CardFooter>
    </Card>
    // <button
    //   onClick={onClick}
    //   className={cn(
    //     'relative group  min-h-36 rounded-lg w-full overflow-hidden transition bg-black border-white border',
    //     'bg-cover bg-center', // Background size and position
    //     'semi-opaque-bg', // Custom class for semi-opaque background

    //     disabled ? 'opacity-30 cursor-not-allowed' : '',
    //     className,
    //   )}
    //   style={backgroundImageStyle}
    // >
    //   <div
    //     className={cn('flex flex-col justify-end gap-y-2 px-4 w-full h-full')}
    //   >
    //     <h2 className='text-lg lg:text-2xl xl:text-3xl line-clamp-1'>{name}</h2>
    //     <div className='flex flex-col gap-y-1 w-full items-center self-center text-brand-dark'>
    //       <h4 className='subtitle text-xs lg:text-sm line-clamp-1'>{title}</h4>
    //       {Icon && <Icon size={20} />}
    //     </div>
    //   </div>
    //   {children}
    // </button>
  );
};

export default HeaderCard;
