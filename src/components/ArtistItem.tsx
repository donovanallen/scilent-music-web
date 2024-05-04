import { Artist } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaUser } from 'react-icons/fa6';

interface ArtistItemProps {
  data: Artist;
}

const ArtistItem: React.FC<ArtistItemProps> = ({ data }) => {
  const imagePath = data.images[0]?.url;

  return (
    <Link href={`/artist/${data.id}`}>
      <div className='rounded-md overflow-hidden bg-neutral-900 cursor-pointer hover:opacity-75 hover:text-brand-light transition'>
        <div className='relative aspect-square rounded-md w-full bg-neutral-700 animated-underline'>
          {imagePath ? (
            <Image
              src={imagePath}
              alt={data.name + ' image'}
              fill
              className='aspect-square object-cover hover:pb-1 transition'
            />
          ) : (
            <FaUser size={64} className='m-auto h-full text-dark' />
          )}
        </div>
        <div className='relative p-3 w-full overflow-clip'>
          <h4 className='truncate'>{data.name}</h4>
          {/* <p className='subtitle font-normal text-neutral-500 truncate'>
            {new Date(timestamp as Date).getFullYear()}
          </p> */}
        </div>
      </div>
    </Link>
  );
};

export default ArtistItem;
