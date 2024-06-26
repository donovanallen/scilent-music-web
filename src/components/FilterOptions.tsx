import { Tooltip } from '@nextui-org/react';
import React from 'react';
import { IoClose } from 'react-icons/io5';

import { cn } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';
import TextButton from '@/components/buttons/TextButton';

import { FilterOption, FilterValue, ReleaseTypes } from '@/constant/types';

import { SearchFilterValue } from '../constant/types';

interface FilterOptionsProps {
  filterOptions: FilterOption[];
  selectedFilter?: FilterValue | SearchFilterValue | ReleaseTypes;
  onFilterSelect: (
    filterValue?: FilterValue | SearchFilterValue | ReleaseTypes,
  ) => void;
  isNullable?: boolean;
  tooltipsEnabled?: boolean;
  className?: string;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  filterOptions,
  selectedFilter,
  onFilterSelect,
  className,
  isNullable,
  tooltipsEnabled = false,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6',
        className,
      )}
    >
      {filterOptions.map((option) => (
        <Tooltip
          key={option.value}
          isDisabled={!tooltipsEnabled}
          shadow='md'
          size='sm'
          content={option.desc}
          classNames={{
            content: 'text-dark bg-light dark:text-light dark:bg-dark',
            base: 'max-w-xs',
          }}
          delay={1000}
        >
          <TextButton
            className={cn(
              'subtitle hover:text-dark/70 text-dark/50 dark:text-light/50 dark:hover:text-brand-dark/70',
              'bg-transparent transition',
              'flex',
              selectedFilter == option.value
                ? 'dark:text-brand-primary text-brand-dark'
                : '',
            )}
            variant='basic'
            onClick={() => onFilterSelect(option.value)}
          >
            {option.label}
          </TextButton>
        </Tooltip>
      ))}
      {isNullable && selectedFilter && (
        <Tooltip
          isDisabled={!tooltipsEnabled}
          content='Clear filters'
          shadow='md'
          size='sm'
          classNames={{
            content: 'text-dark bg-light',
            base: 'max-w-xs',
          }}
          delay={1000}
        >
          <IconButton
            icon={IoClose}
            variant='ghost'
            onClick={() => onFilterSelect(null)}
            disabled={selectedFilter == null}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default FilterOptions;
