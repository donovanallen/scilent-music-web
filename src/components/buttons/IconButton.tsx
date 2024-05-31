import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';
import { ImSpinner2 } from 'react-icons/im';

import { cn } from '@/lib/utils';

const IconButtonVariant = [
  'primary',
  'outline',
  'ghost',
  'light',
  'dark',
] as const;

type IconButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: (typeof IconButtonVariant)[number];
  icon?: IconType | LucideIcon;
  classNames?: {
    icon?: string;
  };
} & React.ComponentPropsWithRef<'button'>;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'primary',
      isDarkBg = false,
      icon: Icon,
      classNames,
      ...rest
    },
    ref,
  ) => {
    const disabled = isLoading || buttonDisabled;

    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded font-medium',
          'focus-visible:ring-light focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
          'min-h-[28px] min-w-[28px] p-1 md:min-h-[34px] md:min-w-[34px] md:p-2',
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-brand-dark/80 text-light',
              'border-dark border',
              'hover:bg-brand-primary/50 hover:text-dark transition',
              'active:bg-brand-primary',
              'disabled:bg-brand-dark/70',
            ],
            variant === 'outline' && [
              'text-light',
              'border-brand-dark border',
              'hover:text-brand-light hover:border-brand-primary active:text-brand-light disabled:bg-brand-dark/70 transition',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'text-brand-dark',
              'shadow-none',
              'hover:text-brand-primary hover:bg-dark/70 active:text-brand-light disabled:text-neutral-700',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'light' && [
              'bg-light text-dark',
              'border border-dark',
              'hover:text-dark hover:bg-neutral-700',
              'active:bg-light/80 disabled:bg-neutral-700',
            ],
            variant === 'dark' && [
              'bg-dark text-light',
              'border border-light',
              'hover:bg-light/70 active:bg-dark/80 disabled:bg-neutral-600',
            ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          isLoading &&
            'relative text-transparent transition-none hover:text-transparent disabled:cursor-wait',
          className,
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              {
                'text-white': ['primary', 'dark'].includes(variant),
                'text-black': ['light'].includes(variant),
                'text-brand-dark': ['outline', 'ghost'].includes(variant),
              },
            )}
          >
            <ImSpinner2 className='animate-spin' />
          </div>
        )}
        {Icon && <Icon size='1em' className={cn(classNames?.icon)} />}
      </button>
    );
  },
);

export default IconButton;
