import { render } from '@testing-library/react';
import React from 'react';

import Skeleton from '@/components/Skeleton';

describe('Skeleton', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<Skeleton />);
    expect(asFragment()).toMatchSnapshot();
  });
});
