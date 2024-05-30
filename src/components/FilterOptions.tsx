import React from 'react';

import { cn } from '@/lib/utils';

import TextButton from '@/components/buttons/TextButton';

import { FilterOption } from '@/constant/types';

interface FilterOptionsProps {
  filterOptions: FilterOption[];
  selectedFilter?: string;
  onFilterSelect: (filterValue?: string) => void;
  className?: string;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  filterOptions,
  selectedFilter,
  onFilterSelect,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6',
        className,
      )}
    >
      {filterOptions.map((option) => (
        <TextButton
          key={option.value}
          className={cn(
            'subtitle text-neutral-800 hover:text-brand-dark',
            'bg-transparent transition',
            'flex',
            selectedFilter == option.value ? 'text-brand-primary' : '',
          )}
          variant='basic'
          onClick={() => onFilterSelect(option.value)}
        >
          {option.label}
        </TextButton>
      ))}
    </div>
  );
};

export default FilterOptions;
