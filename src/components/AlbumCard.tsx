import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Skeleton,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
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
  artistName?: string;
  icon?: IconType;
  title?: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  id,
  name,
  image,
  icon: Icon,
  title,

  type,
  timestamp,
  isDisabled = false,
  className,
  onClick,
  artistName,
}) => {
  const [isCardLoaded, setIsCardLoaded] = useState(false);

  return (
    <Skeleton className='rounded-lg bg-neutral-500' isLoaded={isCardLoaded}>
      <Card
        classNames={{
          base: cn(
            'max-h-[220px] w-full overflow-hidden transition relative',
            'hover:shadow-lg hover:border hover:border-brand-dark dark:hover:border-brand-primary',
            isDisabled ? 'opacity-30' : '',
            className,
          ),
          header: 'absolute z-10 top-1 flex-col items-start w-10/12',
          body: '',
          footer: cn(
            'absolute z-10 bottom-0 bg-black/40 border-t-1 border-default-600 dark:border-default-100 transition',
            'flex-col h-fit w-full overflow-hidden text-left items-start',
          ),
        }}
        key={id}
        radius='lg'
        isFooterBlurred
        isHoverable // update to if children
        isDisabled={isDisabled}
        isPressable={!!onClick}
        onLoad={() => setIsCardLoaded(true)}
        onPress={onClick}
        fullWidth
        className={cn('bg-neutral-900', className)}
      >
        <CardHeader onClick={onClick}>
          {Icon && <Icon size={36} />}
          {type && (
            <NextPill
              text={type}
              variant='solid'
              size='sm'
              radius='sm'
              className=''
            />
          )}
          <h4 className='subtitle text-xs lg:text-sm line-clamp-1 text-dark/50 dark:text-light/50'>
            {title}
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt='Card Image'
          className='z-10 w-full h-full object-cover object-center overflow-hidden aspect-square opacity-50 bg-opacity-50 semi-opaque-bg'
          src={image || ''}
          fallbackSrc={
            <BiAlbum size={64} className='m-auto h-full text-dark' />
          }
        />
        <CardBody></CardBody>

        <CardFooter>
          <h4 className='subtitle font-normal line-clamp-1'>{name}</h4>
          {artistName && (
            <p className='subtitle font-normal text-neutral-500 line-clamp-1'>
              {artistName}
            </p>
          )}
          {timestamp && (
            <p className='subtitle font-normal text-neutral-500 line-clamp-1'>
              {new Date(timestamp)?.getFullYear()}
            </p>
          )}
        </CardFooter>
      </Card>
    </Skeleton>
  );
};

export default AlbumCard;
