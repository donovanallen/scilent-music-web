import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

import { cn, getPrimaryLinks, getSupportedLinks } from '@/lib/utils';

import ExternalLinksModal from '@/components/ExternalLinksModal';

import { ScilentExternalLink, SupportedExternalLink } from '@/constant/types';

const ExternalLink = (link: SupportedExternalLink) => {
  const Icon = link.icon;
  const to = link.url || '';

  return (
    <a target='_blank' href={to} rel='noopener noreferrer'>
      <div
        className={cn(
          'rounded-md p-2 flex gap-x-1 items-center cursor-pointer hover:text-brand-light hover:bg-neutral-700 transition',
        )}
      >
        {Icon && <Icon size={20} />}

        {/* LABEL */}
        {/* <p className='subtitle text-xs'>{link.label}</p> */}
      </div>
    </a>
  );
};

type LinksProps = {
  links: ScilentExternalLink[] | undefined;
  className?: string;
  children?: React.ReactNode;
};

const ExternalLinks: React.FC<LinksProps> = ({
  links,
  className,
  children,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const validLinks: SupportedExternalLink[] | undefined =
    links && getSupportedLinks(links);
  const primaryLinks: SupportedExternalLink[] | undefined =
    validLinks && getPrimaryLinks(validLinks, 'music');

  const openExternalLinksModal = (links: SupportedExternalLink[]) => {
    return (
      <ExternalLinksModal
        isOpen
        onClose={() => setModalOpen(false)}
        links={links}
      ></ExternalLinksModal>
    );
  };

  // if supported links, return icon link to modal
  return (
    <>
      <div className={cn('flex items-center text-neutral-700', className)}>
        {children}
        {primaryLinks
          ? primaryLinks.length > 0 &&
            primaryLinks
              .slice(0, 3)
              .map(
                (link: SupportedExternalLink, i: number) =>
                  link && <ExternalLink key={i} {...link} />,
              )
          : links && <p className='subtitle'>Links</p>}
        <FaPlus
          onClick={() => setModalOpen(true)}
          className='cursor-pointer hover:text-brand-dark transition ml-2'
          size={20}
        />
        {modalOpen && validLinks && openExternalLinksModal(validLinks)}
      </div>
      {/* add custom hover tooltip here */}
    </>
  );
};

export default ExternalLinks;
