import { render } from '@testing-library/react';
import React from 'react';

import ExternalLinksModal from '@/components/ExternalLinksModal';

import { SupportedExternalLink } from '@/constant/types';

describe('ExternalLinksModal', () => {
  const mockLinks: SupportedExternalLink[] = [];

  it('renders correctly', () => {
    const { asFragment } = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <ExternalLinksModal links={mockLinks} isOpen onClose={() => {}} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
