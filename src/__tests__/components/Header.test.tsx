import { render } from '@testing-library/react';
import React from 'react';

import Header from '@/components/Header';

describe('Header', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
