import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/links/UnstyledLink';

const IconLinkVariant = [
  'primary',
  'outline',
  'ghost',
  'light',
  'dark',
] as const;
const IconLinkSize = ['sm', 'base', 'lg'] as const;

type IconLinkProps = {
  isDarkBg?: boolean;
  variant?: (typeof IconLinkVariant)[number];
  size?: (typeof IconLinkSize)[number];

  icon?: IconType | LucideIcon;
  classNames?: {
    icon?: string;
  };
} & Omit<UnstyledLinkProps, 'children'>;

const IconLink = React.forwardRef<HTMLAnchorElement, IconLinkProps>(
  (
    {
      className,
      icon: Icon,
      variant = 'outline',
      size = 'base',
      isDarkBg = false,
      classNames,
      ...rest
    },
    ref,
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        type='button'
        className={cn(
          'inline-flex items-center justify-center rounded font-medium',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
          'min-h-[28px] min-w-[28px] p-1 md:min-h-[34px] md:min-w-[34px] md:p-2',
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-dark text-light',
              'border-light border',
              'hover:text-brand-dark active:text-brand-primary disabled:text-neutral-700',
            ],
            variant === 'outline' && [
              'text-light',
              'border-light border',
              'hover:text-brand-dark active:text-brand-primary disabled:text-neutral-700',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'text-neutral-400',
              'shadow-none',
              'hover:text-brand-dark active:text-brand-primary disabled:text-neutral-700',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'light' && [
              'bg-light text-dark',
              'border border-gray-300',
              'hover:text-dark hover:bg-white',
              'active:bg-white/80 disabled:bg-gray-200',
            ],
            variant === 'dark' && [
              'bg-gray-900 text-white',
              'border border-gray-600',
              'hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
            ],
          ],
          //#endregion  //*======== Variants ===========
          //#region  //*=========== Size ===========
          [size === 'lg' && 'p-2', size === 'base' && 'p-1.5'],
          //#endregion  //*======== Size ===========
          'disabled:cursor-not-allowed',
          className,
        )}
        {...rest}
      >
        {Icon && (
          <Icon
            size='1em'
            className={cn(
              classNames?.icon,
              //#region  //*=========== Size ===========
              [
                size === 'lg' && 'text-xl',
                size === 'base' && 'text-base',
                size === 'sm' && 'text-xs',
              ],
              //#endregion  //*======== Size ===========
            )}
          />
        )}
      </UnstyledLink>
    );
  },
);

export default IconLink;
