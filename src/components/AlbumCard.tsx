// import NextImage from '@/components/NextImage';
import { Card, CardBody, CardFooter, Image, Skeleton } from '@nextui-org/react';
import React, { useState } from 'react';
import { BiAlbum } from 'react-icons/bi';

import { cn } from '@/lib/utils';

import NextPill from '@/components/Pill';

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
  const [isCardLoaded, setIsCardLoaded] = useState(false);

  return (
    <Skeleton className='rounded-md bg-neutral-500' isLoaded={isCardLoaded}>
      <Card
        key={id}
        shadow='sm'
        radius='md'
        fullWidth
        isDisabled={isDisabled}
        isHoverable
        isPressable
        onLoad={() => setIsCardLoaded(true)}
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
              radius='sm'
              className='absolute bottom-1.5 right-1.5 text-dark'
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
    </Skeleton>
  );
};

export default AlbumCard;
