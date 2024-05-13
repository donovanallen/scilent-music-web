'use client';

import { zoomies } from 'ldrs';
import * as React from 'react';
// type LoadingIndicatorProps = React.ComponentPropsWithoutRef<'div'>;

export default function LoadingIndicator() {
  zoomies.register();
  return (
    <div>
      <l-zoomies
        size='150'
        stroke='2'
        bg-opacity='0.2'
        speed='1.2'
        color='#f9d3b4'
      ></l-zoomies>
    </div>
  );
}
