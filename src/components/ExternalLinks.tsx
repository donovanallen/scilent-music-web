import { Tooltip } from '@nextui-org/react';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

import { cn, getPrimaryLinks, getSupportedLinks } from '@/lib/utils';

import ExternalLinksModal from '@/components/ExternalLinksModal';
import IconLink from '@/components/links/IconLink';

import { ScilentExternalLink, SupportedExternalLink } from '@/constant/types';

type LinksProps = {
  links: ScilentExternalLink[] | undefined;
  className?: string;
  children?: React.ReactNode;
};

// TODO on hover, slide out more supported music links, everything else in modal */
const ExternalLinks: React.FC<LinksProps> = ({
  links,
  className,
  children,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>();

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

  const ExternalLink = (link: SupportedExternalLink) => {
    const Icon = link.icon;
    const to = link.url || '';

    return (
      <Tooltip
        content={
          link.label
            ? `Go to ${link.label}`
            : 'Anywhere you see the Spotify icon, click to go directly to the app for any profile, artist, album, track, or playlist.'
        }
        delay={1000}
        classNames={{
          content: 'text-dark bg-light',
          base: 'max-w-xs',
        }}
      >
        <IconLink
          href={to}
          target='_blank'
          rel='noopener noreferrer'
          icon={Icon}
          variant='ghost'
          className='relative text-lg'
        />
      </Tooltip>
    );
  };

  return (
    <>
      <div className='flex flex-col'>
        {children}
        <div className={cn('flex items-center', className)}>
          {primaryLinks &&
            primaryLinks.length > 0 &&
            primaryLinks
              .slice(0, 3)
              .map(
                (link: SupportedExternalLink, i: number) =>
                  link && <ExternalLink key={i} {...link} />,
              )}

          {validLinks && validLinks.length > 1 && (
            <FaPlus
              onClick={() => setModalOpen(true)}
              className='cursor-pointer text-neutral-500 hover:text-brand-dark transition ml-2'
              size={20}
            />
          )}
          {modalOpen && validLinks && openExternalLinksModal(validLinks)}
        </div>
      </div>
    </>
  );
};

export default ExternalLinks;
