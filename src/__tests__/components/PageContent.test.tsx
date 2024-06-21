import { render } from '@testing-library/react';
import React from 'react';

import PageContent from '@/components/PageContent';

describe('PageContent', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<PageContent />);
    expect(asFragment()).toMatchSnapshot();
  });
});
