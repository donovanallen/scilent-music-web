// components/ListLayout.tsx
import React from 'react';

const ListLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className='flex flex-col space-y-2 my-4 overflow-y-scroll no-scrollbar'>
    {children}
  </div>
);

export default ListLayout;
