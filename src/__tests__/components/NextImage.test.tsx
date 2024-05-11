import { render } from '@testing-library/react';
import React from 'react';

import NextImage from '@/components/NextImage';

describe('NextImage', () => {
  const mockImageSrc = 'http://www.example.com';
  it('renders correctly', () => {
    const { asFragment } = render(
      <NextImage alt='test' fill src={mockImageSrc} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
