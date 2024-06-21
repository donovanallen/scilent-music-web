import { render } from '@testing-library/react';
import React from 'react';

import Modal from '@/components/Modal';

describe('Modal', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <Modal isOpen onChange={() => {}}>
        <div></div>
      </Modal>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
