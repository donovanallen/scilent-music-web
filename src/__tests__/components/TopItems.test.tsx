import { render } from '@testing-library/react';
// eslint-disable-next-line unused-imports/no-unused-imports
import { useRouter } from 'next/router';
import React from 'react';

import TopItems from '@/components/TopItems';

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/some-route',
    pathname: '/some-path',
    query: { key: 'value' },
    asPath: '/some-as-path',
  }),
}));

fdescribe('TopItems', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<TopItems />);
    expect(asFragment()).toMatchSnapshot();
  });
});
