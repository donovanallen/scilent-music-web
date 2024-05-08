import Pill from '@/components/Pill';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaUser } from 'react-icons/fa6';

interface ArtistItemProps {
  id?: string;
  name?: string;
  image?: string;
  timestamp?: string | Date;
  type?: string;
}

const ArtistItem: React.FC<ArtistItemProps> = ({ id, name, image, type }) => {
  const imagePath = image;

  return (
    <Link href={`/artist/${id}`} aria-label={`Go to artist ${name}`}>
      <div className='rounded-md overflow-hidden bg-neutral-900 hover:text-brand-light hover:border-brand-light hover:border transition'>
        <div className='relative aspect-square rounded-md w-full bg-neutral-700 animated-underline'>
          {imagePath ? (
            <Image
              src={imagePath}
              alt={`Image of artist: ${name}`}
              fill
              className='aspect-square object-cover hover:pb-1 transition'
            />
          ) : (
            <FaUser size={64} className='m-auto h-full text-dark' />
          )}
          {type && (
            <Pill
              text={type}
              className='absolute bottom-2 right-2 bg-neutral-800/90 rounded-md'
            />
          )}
        </div>
        <div className='relative p-3 w-full overflow-clip'>
          <h4 className='truncate'>{name}</h4>
        </div>
      </div>
    </Link>
  );
};

export default ArtistItem;
