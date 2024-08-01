import { Track } from '@spotify/web-api-ts-sdk';
import { render } from '@testing-library/react';
import React from 'react';

import FeedItem from '@/components/FeedItem';

describe('FeedItem', () => {
  const mockData = {} as Track;
  it('renders correctly', () => {
    const { asFragment } = render(<FeedItem data={mockData} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
