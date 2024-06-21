'use client';

import React from 'react';
import { IconType } from 'react-icons';
import { FaArrowRight } from 'react-icons/fa6';

import ButtonLink from '@/components/links/ButtonLink';
import NextModal from '@/components/Modal';

import { SupportedExternalLink } from '@/constant/types';

const ExternalLinksModal: React.FC<{
  links: SupportedExternalLink[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ links, isOpen = false, onClose }) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <NextModal
      title='Links'
      isOpen={isOpen}
      onChange={onChange}
      className='min-w-fit'
    >
      <div className='flex flex-col gap-y-4'>
        {links.map(
          (link, i) =>
            link && (
              <ButtonLink
                key={i}
                className='animated-underline hover:text-brand-primary'
                leftIcon={link.icon as IconType}
                rightIcon={FaArrowRight}
                variant='primary'
                href={link.url || ''}
                size='base'
                classNames={{ rightIcon: 'ml-4' }}
              >
                {link.label && <h4 className='subtitle'>{link.label}</h4>}
              </ButtonLink>
            ),
        )}
      </div>
    </NextModal>
  );
};

export default ExternalLinksModal;
