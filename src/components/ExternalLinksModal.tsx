'use client';

import React from 'react';
import { IconType } from 'react-icons';

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
    <NextModal title='Links' isOpen={isOpen} onChange={onChange}>
      <div className='flex flex-col items-center gap-y-4 text-center my-4'>
        {links.map(
          (link, i) =>
            link && (
              <ButtonLink
                key={i}
                className='flex items-center w-full justify-between animated-underline'
                rightIcon={link.icon as IconType}
                variant='primary'
                href={link.url || ''}
                size='lg'
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
