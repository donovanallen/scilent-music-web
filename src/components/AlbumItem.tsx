import Link from 'next/link';
import React from 'react';
import { BiAlbum } from 'react-icons/bi';

import NextImage from '@/components/NextImage';
import Pill from '@/components/Pill';

interface AlbumItemProps {
  id?: string;
  name?: string;
  image?: string;
  timestamp?: string | Date;
  type?: string;
}

const AlbumItem: React.FC<AlbumItemProps> = ({
  id,
  name,
  image,
  type,
  timestamp,
}) => {
  const imagePath = image;

  return (
    <Link href={`/release/${id}`} aria-label={`Go to album ${name}`}>
      <div className='rounded-md overflow-hidden bg-neutral-900 hover:text-brand-light hover:border-brand-light hover:border transition'>
        {/* IMAGE */}
        <div className='relative aspect-square rounded-md w-full bg-neutral-700 animated-underline'>
          {imagePath ? (
            <NextImage
              src={imagePath}
              alt={`Image of album: ${name}`}
              fill
              className='aspect-square object-cover hover:pb-1 transition'
              useSkeleton
            />
          ) : (
            <BiAlbum size={64} className='m-auto h-full text-dark' />
          )}
          {type && (
            <Pill
              text={type}
              className='absolute bottom-2 right-2 bg-neutral-800/90'
            />
          )}
        </div>

        {/* TITLE/SUBTITLE */}
        <div className='relative p-3 w-full overflow-clip'>
          <p className='subtitle font-normal truncate'>{name}</p>
          <p className='subtitle font-normal text-neutral-500 truncate'>
            {timestamp ? new Date(timestamp)?.getFullYear() : ''}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AlbumItem;
