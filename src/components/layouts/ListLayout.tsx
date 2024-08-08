import React from 'react';

const ListLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className='flex flex-col gap-y-4 my-4 overflow-y-scroll no-scrollbar items-start'>
    {children}
  </div>
);

export default ListLayout;
