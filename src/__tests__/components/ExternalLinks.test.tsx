import { render } from '@testing-library/react';
import React from 'react';

import ExternalLinks from '@/components/ExternalLinks';

import { ScilentExternalLink } from '@/constant/types';

describe('ExternalLinks', () => {
  const mockLinks: ScilentExternalLink[] = [];
  it('renders correctly', () => {
    const { asFragment } = render(<ExternalLinks links={mockLinks} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
