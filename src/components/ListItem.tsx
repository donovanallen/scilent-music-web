'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaImage } from 'react-icons/fa6';

import { cn } from '@/lib/utils';

interface ListItemProps {
  image: string;
  name: string;
  href: string;
  className: string;
}

const ListItem: React.FC<ListItemProps> = ({
  image,
  name,
  href,
  className,
}) => {
  const router = useRouter();

  const onClick = () => {
    // TODO: Add auth before push
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/20 transition',
        className,
      )}
    >
      <div className='relative min-h-[64px] min-w-[64px] bg-neutral-700'>
        {image ? (
          <Image
            className='aspect-square object-cover'
            src={image}
            alt={name + ' image'}
            fill
          />
        ) : (
          <FaImage size={24} className='m-auto h-full text-dark' />
        )}
      </div>
      <p className='truncate'>{name}</p>
    </button>
  );
};

export default ListItem;
