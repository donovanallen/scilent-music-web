import { Skeleton } from '@nextui-org/react';
import Image, { ImageProps } from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';

type NextImageProps = {
  useSkeleton?: boolean;
  classNames?: {
    image?: string;
    blur?: string;
  };
  alt: string;
} & (
  | { width: string | number; height: string | number }
  | { layout: 'fill'; width?: string | number; height?: string | number }
  | { fill: boolean }
) &
  ImageProps;

/**
 *
 * @description Must set width using `w-` className
 * @param useSkeleton add background with pulse animation, don't use it if image is transparent
 */
export default function NextImage({
  useSkeleton = false,
  src,
  width,
  height,
  fill,
  alt,
  className,
  classNames,
  ...rest
}: NextImageProps) {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const [_status, _setStatus] = React.useState(
    useSkeleton ? 'loading' : 'complete',
  );
  const widthIsSet = className?.includes('w-') ?? false;

  return (
    <Skeleton className='rounded-md bg-neutral-500' isLoaded={isImageLoaded}>
      <div
        style={!widthIsSet ? { width: `${width}px` } : undefined}
        className={className}
      >
        <Image
          className={cn(
            'relative aspect-square object-cover',
            classNames?.image,
          )}
          src={src}
          width={width}
          height={height}
          fill={fill}
          alt={alt}
          onLoad={() => setIsImageLoaded(true)}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          {...rest}
        />
      </div>
    </Skeleton>
  );
}
