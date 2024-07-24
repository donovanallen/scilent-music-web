// components/ViewToggle.tsx
import { Tab, Tabs } from '@nextui-org/react';
import React, { Key } from 'react';
import { IoGrid, IoList } from 'react-icons/io5';

import { cn } from '@/lib/utils';

export type ViewType = 'grid' | 'list';

interface ViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  view,
  onViewChange,
  className,
}) => {
  return (
    <Tabs
      aria-label='View options'
      color='default'
      variant='bordered'
      size='sm'
      radius='md'
      defaultSelectedKey={view || 'grid'}
      selectedKey={view}
      onSelectionChange={onViewChange as (view: Key) => void}
      classNames={{
        base: cn(className, ''),
        tab: 'subtitle text-xs',
      }}
    >
      <Tab key='grid' title={<IoGrid />} />
      <Tab key='list' title={<IoList />} />
    </Tabs>
  );
};

export default ViewToggle;
