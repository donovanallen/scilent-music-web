import { render } from '@testing-library/react';
import React from 'react';

import HeaderItem from '@/components/HeaderItem';

describe('HeaderItem', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<HeaderItem />);
    expect(asFragment()).toMatchSnapshot();
  });
});
