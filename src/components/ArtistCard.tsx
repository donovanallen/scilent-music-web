// import NextImage from '@/components/NextImage';
import { Card, CardBody, CardFooter, Image, Skeleton } from '@nextui-org/react';
import React, { useState } from 'react';
import { BiAlbum } from 'react-icons/bi';

import { cn } from '@/lib/utils';

interface ArtistCardProps {
  id?: string;
  name?: string;
  image?: string;
  type?: string;
  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  id,
  name,
  image,
  type,
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
        onPress={onClick}
        className={cn('bg-neutral-900', className)}
        onLoad={() => setIsCardLoaded(true)}
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
          {/* {type && (
          <NextPill
            text={type}
            variant='solid'
            size='sm'
            className='absolute bottom-1.5 right-1.5'
          />
        )} */}
        </CardBody>
        <CardFooter className='flex-col w-full overflow-clip text-left items-start'>
          <h4 className='line-clamp-1'>{name}</h4>
        </CardFooter>
      </Card>
    </Skeleton>
  );
};

export default ArtistCard;
