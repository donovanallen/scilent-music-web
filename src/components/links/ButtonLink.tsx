import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/links/UnstyledLink';

const ButtonLinkVariant = [
  'primary',
  'outline',
  'ghost',
  'light',
  'dark',
] as const;
const ButtonLinkSize = ['sm', 'base', 'lg'] as const;

type ButtonLinkProps = {
  isDarkBg?: boolean;
  variant?: (typeof ButtonLinkVariant)[number];
  size?: (typeof ButtonLinkSize)[number];
  leftIcon?: IconType | LucideIcon;
  rightIcon?: IconType | LucideIcon;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
} & UnstyledLinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      size = 'base',
      variant = 'primary',
      isDarkBg = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className,
      classNames,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={cn(
          'inline-flex items-center justify-between rounded-lg font-medium subtitle cursor-pointer',
          'focus-visible:ring-light focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
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
              'bg-dark text-light hover:text-white active:text-white',
              'border-neutral-400 border',
              'disabled:opacity-80',
            ],
            variant === 'outline' && [
              'text-light hover:text-white active:text-white',
              'border-light border',
              'disabled:opacity-80',
              isDarkBg &&
                'bg-dark hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'text-light hover:text-white active:text-white',
              'shadow-none',
              'disabled:bg-opacity-80',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'light' && [
              'bg-light text-dark hover:bg-white',
              'border border-gray-300',
              'active:bg-white/80 disabled:bg-gray-200',
            ],
            variant === 'dark' && [
              'bg-dark text-light hover:text-white active:text-white',
              'border-neutral-400 border',
              'disabled:opacity-80',
            ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          className,
        )}
      >
        <div className='inline-flex items-center gap-x-2'>
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
        </div>
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
      </UnstyledLink>
    );
  },
);

export default ButtonLink;
