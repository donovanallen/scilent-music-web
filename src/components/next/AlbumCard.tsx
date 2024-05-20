// import NextImage from '@/components/NextImage';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import React from 'react';
import { BiAlbum } from 'react-icons/bi';

import { cn } from '@/lib/utils';

import NextPill from '@/components/next/Pill';

interface AlbumCardProps {
  id?: string;
  name?: string;
  image?: string;
  timestamp?: string | Date;
  type?: string;
  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  id,
  name,
  image,
  type,
  timestamp,
  isDisabled = false,
  className,
  onClick,
}) => {
  const imagePath = image;

  return (
    <Card
      key={id}
      shadow='sm'
      radius='md'
      fullWidth
      isDisabled={isDisabled}
      isHoverable
      isPressable
      onPress={onClick}
      className={cn('bg-neutral-900', className)}
    >
      <CardBody className='p-0 relative aspect-square w-full'>
        {imagePath ? (
          <Image
            shadow='md'
            radius='md'
            width='100%'
            alt={name}
            className='w-full object-cover aspect-square'
            src={imagePath}
          />
        ) : (
          <BiAlbum size={64} className='m-auto h-full text-dark' />
        )}
        {type && (
          <NextPill
            text={type}
            variant='solid'
            size='sm'
            className='absolute bottom-1.5 right-1.5'
          />
        )}
      </CardBody>
      <CardFooter className='flex-col w-full overflow-clip text-left items-start'>
        <h4 className='subtitle font-normal line-clamp-1'>{name}</h4>
        <p className='subtitle font-normal text-neutral-500 line-clamp-1'>
          {timestamp && new Date(timestamp)?.getFullYear()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default AlbumCard;
