import { render } from '@testing-library/react';
import React from 'react';

import NavigationBar from '@/components/NavigationBar';

describe('NavigationBar', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<NavigationBar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
