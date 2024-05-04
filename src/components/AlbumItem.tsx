// import { Album } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BiAlbum } from 'react-icons/bi';

import Pill from '@/components/Pill';

interface AlbumItemProps {
  id?: string;
  name?: string;
  image?: string | any;
  timestamp?: string | Date;
  type?: string;
  // album?: Album | any;
  // artist?: string | any;
  // className?: string;
}

const AlbumItem: React.FC<AlbumItemProps> = ({
  id,
  name,
  image,
  type,
  timestamp,
  // album,
  // artist,
  // className,
}) => {
  const imagePath = image;

  return (
    <Link href={`/release/${id}`}>
      <div className='rounded-md overflow-hidden bg-neutral-900 cursor-pointer hover:opacity-75 hover:text-brand-light transition'>
        <div className='relative aspect-square rounded-md w-full bg-neutral-700 animated-underline'>
          {imagePath ? (
            <Image
              src={imagePath}
              alt={name + ' image'}
              fill
              className='aspect-square object-cover hover:pb-1 transition'
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
        <div className='relative p-3 w-full overflow-clip'>
          <h4 className='subtitle font-normal truncate'>{name}</h4>
          <p className='subtitle font-normal text-neutral-500 truncate'>
            {new Date(timestamp as Date).getFullYear()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AlbumItem;
