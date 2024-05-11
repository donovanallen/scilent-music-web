import { render } from '@testing-library/react';
import React from 'react';

import Box from '@/components/Box';

describe('Box', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <Box>
        <div></div>
      </Box>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
