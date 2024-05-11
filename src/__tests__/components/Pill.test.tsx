import { render } from '@testing-library/react';
import React from 'react';

import Pill from '@/components/Pill';

describe('Pill', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<Pill text='Test' />);
    expect(asFragment()).toMatchSnapshot();
  });
});
