import { render } from '@testing-library/react';
import React from 'react';

import Feed from '@/components/Feed';

describe('Feed', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<Feed />);
    expect(asFragment()).toMatchSnapshot();
  });
});
