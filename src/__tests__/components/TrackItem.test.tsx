import { Track } from '@spotify/web-api-ts-sdk';
import { render } from '@testing-library/react';
import React from 'react';

import TrackItem from '@/components/TrackItem';

describe('TrackItem', () => {
  const mockTrack = {} as Track;
  it('renders correctly', () => {
    const { asFragment } = render(<TrackItem track={mockTrack} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
