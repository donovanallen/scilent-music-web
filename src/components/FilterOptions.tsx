import React from 'react';
import { IoClose } from 'react-icons/io5';

import { cn } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';
import TextButton from '@/components/buttons/TextButton';

import { FilterOption, FilterValue } from '@/constant/types';

import { SearchFilterValue } from '../constant/types';

interface FilterOptionsProps {
  filterOptions: FilterOption[];
  selectedFilter?: FilterValue | SearchFilterValue;
  onFilterSelect: (filterValue?: FilterValue | SearchFilterValue) => void;
  isNullable?: boolean;
  className?: string;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  filterOptions,
  selectedFilter,
  onFilterSelect,
  className,
  isNullable,
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
      {isNullable && selectedFilter && (
        <IconButton
          icon={IoClose}
          variant='ghost'
          onClick={() => onFilterSelect(null)}
          disabled={selectedFilter == null}
        />
      )}
    </div>
  );
};

export default FilterOptions;
