'use client';

import React from 'react';
import { IconType } from 'react-icons';

import Button from '@/components/Button';
import Modal from '@/components/Modal';

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

  const openExternalLink = (url: string | undefined) => {
    if (!url) {
      return null;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getIcon = (icon: IconType) => {
    const Icon = icon;
    return <Icon />;
  };

  return (
    <Modal
      title='Links'
      description=''
      isOpen={isOpen}
      onChange={onChange}
      className='py-6'
    >
      <div className='flex flex-col items-center gap-y-4 text-center my-4'>
        {links.map(
          (link, i) =>
            link && (
              <Button
                key={i}
                onClick={() => openExternalLink(link.url)}
                className='flex items-center gap-x-2 w-full rounded-lg px-6'
              >
                <>
                  {link.icon && getIcon(link.icon)}
                  {link.label && <h4 className='subtitle'>{link.label}</h4>}
                </>
              </Button>
            ),
        )}
      </div>
    </Modal>
  );
};

export default ExternalLinksModal;
