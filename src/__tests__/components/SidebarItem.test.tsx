import { render } from '@testing-library/react';
import React from 'react';

import SidebarItem from '@/components/SidebarItem';

describe('SidebarItem', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<SidebarItem label='Test' href='' />);
    expect(asFragment()).toMatchSnapshot();
  });
});
