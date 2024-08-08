import { Avatar, Card, CardFooter, CardHeader, Image } from '@nextui-org/react';
import React, { useState } from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

interface UserCardProps {
  id?: string;
  name?: string;
  image?: string;

  title?: string;
  icon?: IconType;

  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;

  // type?: string;
  // children?: React.ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  title,
  image,
  icon: Icon,

  isDisabled = false,
  className,
  onClick,

  // type,
  // children,
}) => {
  const [isCardLoaded, setIsCardLoaded] = useState(false);

  return (
    // <Skeleton className='rounded-lg bg-neutral-500' isLoaded={isCardLoaded}>
    <Card
      classNames={{
        base: cn(
          'max-h-[220px] w-full overflow-hidden transition relative',
          'hover:shadow-lg hover:border hover:border-brand-dark dark:hover:border-brand-primary',
          isDisabled ? 'opacity-30' : 'cursor-pointer',
          className,
        ),
        header: 'absolute z-10 top-1 flex-col items-start w-10/12',
        body: '',
        footer: cn(
          'absolute z-10 bottom-0 bg-black/40 border-t-1 border-default-600 dark:border-default-100 transition',
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
    >
      <CardHeader onClick={onClick}>
        {Icon && <Icon size={36} />}
        <h4 className='subtitle text-xs lg:text-sm line-clamp-1 text-dark/50 dark:text-light/50'>
          {title}
        </h4>
      </CardHeader>
      {image ? (
        <Image
          removeWrapper
          alt='Card Image'
          className='z-10 w-full h-full object-cover object-center overflow-hidden aspect-square opacity-50 bg-opacity-50 semi-opaque-bg'
          src={image}
          // TODO: add fallback image
        />
      ) : (
        <Avatar
          size='lg'
          alt={name}
          classNames={{
            base: 'h-full w-full object-cover object-center overflow-hidden aspect-square flex items-center justify-center self-center',
            img: 'h-1/2 w-1/2',
          }}
        />
      )}
      <CardFooter>
        <h4 className='text-brand-light text-left text-sm font-medium line-clamp-1'>
          {name}
        </h4>
      </CardFooter>
    </Card>
    // </Skeleton>
  );
};

export default UserCard;
