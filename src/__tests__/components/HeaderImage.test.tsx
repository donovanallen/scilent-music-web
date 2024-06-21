import { render } from '@testing-library/react';
import React from 'react';

import HeaderImage from '@/components/HeaderImage';

describe('HeaderImage', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<HeaderImage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
