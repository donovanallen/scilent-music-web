import { render } from '@testing-library/react';
import React from 'react';

import AuthModal from '@/components/AuthModal';

describe('AuthModal', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<AuthModal />);
    expect(asFragment()).toMatchSnapshot();
  });
});
