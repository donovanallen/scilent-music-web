import { render } from '@testing-library/react';
import React from 'react';

import Button from '@/components/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<Button />);
    expect(asFragment()).toMatchSnapshot();
  });
});
