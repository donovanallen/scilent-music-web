import { Artist } from '@spotify/web-api-ts-sdk';
import Link from 'next/link';

interface ArtistLinkProps {
  artist: Artist;
  children?: React.ReactNode;
  // className?: string;
}

const ArtistLink: React.FC<ArtistLinkProps> = ({
  artist,
  children,
  // className,
}) => {
  return <Link href={`/artist/${artist.id}`}>{children}</Link>;
};

export default ArtistLink;
