import React from 'react';
import { IconType } from 'react-icons';

import NextImage from '@/components/NextImage';

import Logo from '~/svg/Logo_Gray.svg';

type HeaderImageProps = {
  imageUrl?: string;
  alt?: string;
  fallbackIcon?: IconType;
};

const HeaderImage: React.FC<HeaderImageProps> = ({
  imageUrl,
  alt,
  fallbackIcon,
}) => {
  const Icon = fallbackIcon;

  return imageUrl ? (
    <div className='relative aspect-square w-28 rounded-md overflow-hidden bg-neutral-700'>
      <NextImage
        src={imageUrl}
        alt={alt || 'Header image'}
        fill
        className='aspect-square object-cover'
        useSkeleton
        priority
      />
    </div>
  ) : Icon ? (
    <>
      <Icon size={36} className='m-auto h-full text-dark' />
    </>
  ) : (
    <div className='relative aspect-square w-28 rounded-md overflow-hidden bg-neutral-700 flex items-center justify-center'>
      <Logo className='w-1/2' />
    </div>
  );
};

export default HeaderImage;
