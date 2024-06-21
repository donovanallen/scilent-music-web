import { render } from '@testing-library/react';
import React from 'react';

import ArtistItem from '@/components/ArtistItem';

describe('ArtistItem', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<ArtistItem />);
    expect(asFragment()).toMatchSnapshot();
  });
});
