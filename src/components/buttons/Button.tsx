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
