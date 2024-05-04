import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = 'button', ...props }, ref) => {
    return (
      <button
        type={type}
        disabled={disabled}
        className={cn(
          `w-fit rounded-md border border-transparent p-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-75 transition text-dark bg-light subtitle`,
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export default Button;
