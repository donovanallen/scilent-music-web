// components/GridLayout.tsx
import React from 'react';

const GridLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 my-4 overflow-y-scroll no-scrollbar'>
    {children}
  </div>
);

export default GridLayout;
