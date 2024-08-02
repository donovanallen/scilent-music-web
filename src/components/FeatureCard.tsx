import { Card, CardBody } from '@nextui-org/react';
import React from 'react';
import { IconType } from 'react-icons';

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <Card
      isBlurred
      className='border-none bg-background/60 dark:bg-default-100/50 max-w-[300px]'
      shadow='sm'
    >
      <CardBody>
        <div className='flex flex-col items-start gap-y-6 p-4'>
          <div className='flex flex-col items-start gap-y-2 w-full'>
            {Icon && <Icon size={48} className='self-start' />}
            <h3 className='mb-2 text-brand-primary'>{title}</h3>
          </div>
          <p className='text-light flex'>{description}</p>
        </div>
      </CardBody>
      {/* <CardHeader onClick={onClick}>
          {Icon && <Icon size={36} />}
          {type && (
            <NextPill
              text={type}
              variant='solid'
              size='sm'
              radius='sm'
              className=''
            />
          )}
          <h4 className='subtitle text-xs lg:text-sm line-clamp-1 text-dark/50 dark:text-light/50'>
            {title}
          </h4>
        </CardHeader> */}
      {/* <Image
          removeWrapper
          alt='Card Image'
          className='z-10 w-full h-full object-cover object-center overflow-hidden aspect-square opacity-50 bg-opacity-50 semi-opaque-bg'
          src={image || ''}
          fallbackSrc={
            <BiAlbum size={64} className='m-auto h-full text-dark' />
          }
        /> */}

      {/* <CardFooter>
          <h4 className='subtitle font-normal line-clamp-1'>{name}</h4>
          {artistName && (
            <p className='subtitle font-normal text-neutral-500 line-clamp-1'>
              {artistName}
            </p>
          )}
          {timestamp && (
            <p className='subtitle font-normal text-neutral-500 line-clamp-1'>
              {new Date(timestamp)?.getFullYear()}
            </p>
          )}
        </CardFooter> */}
    </Card>
  );
};

export default FeatureCard;
