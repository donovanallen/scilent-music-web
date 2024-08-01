import { render } from '@testing-library/react';
import React from 'react';

import AlbumItem from '@/components/AlbumItem';

describe('AlbumItem', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<AlbumItem />);
    expect(asFragment()).toMatchSnapshot();
  });
});
