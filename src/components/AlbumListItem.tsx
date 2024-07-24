import { Avatar, Skeleton } from '@nextui-org/react';
import React, { useState } from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

interface AlbumListItemProps {
  id?: string;
  name?: string;
  title?: string;

  image?: string;
  type?: string;
  icon?: IconType;

  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;

  artistName?: string;

  // children?: React.ReactNode;
}

const AlbumListItem: React.FC<AlbumListItemProps> = ({
  id,
  name,
  image,

  icon: Icon,
  isDisabled = false,
  className,
  onClick,

  artistName,
  // type,
  // children,
}) => {
  const [isItemLoaded, setIsItemLoaded] = useState(false);

  return (
    <Skeleton className='rounded-lg bg-neutral-500' isLoaded={isItemLoaded}>
      <div
        key={id}
        className={cn(
          'flex items-center p-2 hover:opacity-80 cursor-pointer',
          className,
        )}
        onClick={onClick}
        onLoad={() => setIsItemLoaded(true)}
      >
        <Avatar radius='md' src={image} alt={name} size='lg' className='mr-6' />
        <div className='flex flex-col items-start'>
          <h3 className='text-dark dark:text-light font-normal line-clamp-1'>
            {name}
          </h3>
          <h4 className='text-dark/70 dark:text-light/70 font-light line-clamp-1'>
            {artistName}
          </h4>
        </div>
      </div>
    </Skeleton>
  );
};

export default AlbumListItem;
