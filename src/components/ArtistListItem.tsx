import { Avatar, Skeleton } from '@nextui-org/react';
import React, { useState } from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

interface ArtistListItemProps {
  id?: string;
  name?: string;
  title?: string;

  image?: string;
  type?: string;
  icon?: IconType;

  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;

  // children?: React.ReactNode;
}

const ArtistListItem: React.FC<ArtistListItemProps> = ({
  id,
  name,
  image,

  icon: Icon,
  isDisabled = false,
  className,
  onClick,

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
        <Avatar src={image} alt={name} size='lg' className='mr-6' />
        <h3 className='text-dark dark:text-light font-normal line-clamp-1'>
          {name}
        </h3>
      </div>
    </Skeleton>
  );
};

export default ArtistListItem;
