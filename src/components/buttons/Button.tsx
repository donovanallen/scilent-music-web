import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';
import { ImSpinner2 } from 'react-icons/im';

import { cn } from '@/lib/utils';

const ButtonVariant = ['primary', 'outline', 'ghost', 'light', 'dark'] as const;
const ButtonSize = ['sm', 'base', 'lg'] as const;

type ButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: (typeof ButtonVariant)[number];
  size?: (typeof ButtonSize)[number];
  leftIcon?: IconType | LucideIcon;
  rightIcon?: IconType | LucideIcon;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
} & React.ComponentPropsWithRef<'button'>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'base',
      variant = 'primary',
      isDarkBg = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      disabled: buttonDisabled,
      isLoading,
      children,
      className,
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
          'inline-flex items-center rounded font-medium subtitle',
          'focus-visible:ring-light focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition duration-75',
          //#region  //*=========== Size ===========
          [
            size === 'lg' && ['px-6 py-4', 'text-lg'],
            size === 'base' && ['px-4 py-2', 'text-base'],
            size === 'sm' && ['px-2 py-1', 'text-xs md:text-sm'],
          ],
          //#endregion  //*======== Size ===========
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              // BACKGROUND
              'bg-brand-dark dark:bg-brand-dark/80',
              // BORDER
              'border border-brand-dark',
              // TEXT
              'text-light',
              // STATES
              'hover:bg-brand-dark/70',
              'dark:hover:bg-brand-primary/60',
              'active:bg-brand-dark/60 active:text-dark',
              'dark:active:bg-brand-primary/50 dark:active:text-dark',
              'disabled:bg-brand-dark/70 disabled:text-dark/70',
            ],
            variant === 'outline' && [
              // BACKGROUND
              'bg-transparent',
              // BORDER
              'border-2 border-dark dark:border-brand-dark/80',
              // TEXT
              'text-dark dark:text-brand-light',
              // STATES
              'hover:text-brand-dark hover:border-brand-dark',
              'dark:hover:text-brand-light dark:hover:border-brand-primary',
              'active:text-brand-dark/80',
              'dark:active:text-brand-dark/80',
              'disabled:border-brand-dark/80 disabled:text-dark/70',
              'dark:disabled:border-brand-dark/70 dark:disabled:text-light/70',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'bg-transparent',
              'border-none',
              'shadow-none',
              // LIGHT
              'text-dark',
              'hover:text-brand-dark',
              'active:text-brand-light',
              'disabled:text-dark/60',
              // DARK
              'dark:text-light',
              'dark:hover:text-brand-dark',
              'dark:active:text-brand-dark/70',
              'dark:disabled:text-light/70',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'light' && [
              'bg-light text-dark',
              'hover:text-dark hover:bg-brand-dark/40',
              'dark:hover:bg-brand-primary/70',
              'dark:active:bg-brand-primary',
              'active:bg-brand-dark/80',
              'disabled:bg-light/60',
            ],
            variant === 'dark' && [
              'bg-dark text-light',
              'hover:bg-brand-dark',
              'active:bg-brand-dark/70',
              'disabled:bg-dark/60',
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
                'text-white': ['primary', 'dark', 'ghost'].includes(variant),
                'text-black': ['light'].includes(variant),
                'text-brand-dark': ['outline'].includes(variant),
              },
            )}
          >
            <ImSpinner2 className='animate-spin' />
          </div>
        )}
        {LeftIcon && (
          <div
            className={cn([
              size === 'lg' && 'mr-1.2',
              size === 'base' && 'mr-1',
              size === 'sm' && 'mr-1.5',
            ])}
          >
            <LeftIcon
              size='1em'
              className={cn(
                [
                  size === 'lg' && 'text-lg',
                  size === 'base' && 'text-base',
                  size === 'sm' && 'text-sm',
                ],
                classNames?.leftIcon,
              )}
            />
          </div>
        )}
        {children}
        {RightIcon && (
          <div
            className={cn([
              size === 'lg' && 'ml-1.2',
              size === 'base' && 'ml-1',
              size === 'sm' && 'ml-1.5',
            ])}
          >
            <RightIcon
              size='1em'
              className={cn(
                [
                  size === 'lg' && 'text-lg',
                  size === 'base' && 'text-base',
                  size === 'sm' && 'text-sm',
                ],
                classNames?.rightIcon,
              )}
            />
          </div>
        )}
      </button>
    );
  },
);

export default Button;
