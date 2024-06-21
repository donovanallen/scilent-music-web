import { render } from '@testing-library/react';
import React from 'react';

import Sidebar from '@/components/Sidebar';

describe('Sidebar', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <Sidebar>
        <div></div>
      </Sidebar>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
