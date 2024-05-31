import React from 'react';

import { cn } from '@/lib/utils';

import TextButton from '@/components/buttons/TextButton';

interface FilterOptionsProps {
  options: {
    value: 'short_term' | 'medium_term' | 'long_term' | undefined;
    label: string;
  }[];
  selected?: string;
  onChange: (value: string | undefined) => void;
}

const FilterOptions = ({ options, selected, onChange }: FilterOptionsProps) => {
  return (
    <div className='flex items-center w-fit gap-x-2 sm:gap-x-4 lg:gap-x-6'>
      {options.map((option) => (
        <TextButton
          key={option.value}
          className={cn(
            'subtitle text-neutral-800 hover:text-brand-dark',
            'bg-transparent transition',
            'flex',
            selected == option.value ? 'text-brand-primary' : '',
          )}
          variant='basic'
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </TextButton>
      ))}
    </div>
  );
};

export default FilterOptions;
