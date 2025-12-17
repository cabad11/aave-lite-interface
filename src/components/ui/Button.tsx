import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Button } from '@headlessui/react';

const buttonVariants = cva(
  `
    inline-flex h-8 shrink-0 cursor-pointer items-center justify-center
    rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all
    outline-none
    disabled:pointer-events-none disabled:opacity-50
    aria-invalid:border-destructive aria-invalid:ring-destructive/20
    data-focus:border-ring data-focus:ring-[3px] data-focus:ring-ring/50
  `,
  {
    variants: {
      variant: {
        default: `
          bg-primary text-primary-foreground
          hover:bg-primary/90
        `,
        white: `
          border bg-background text-foreground
          hover:bg-accent hover:text-accent-foreground
          dark:border-input dark:bg-input/30 dark:hover:bg-input/50
        `,
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof buttonVariants>
  & {
    invalid?: boolean
  };

const CustomButton = ({ variant, className, children, invalid, ...props }: ButtonProps) => {
  return (
    <Button
      className={cn(buttonVariants({ variant, className }))}
      aria-invalid={invalid}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
