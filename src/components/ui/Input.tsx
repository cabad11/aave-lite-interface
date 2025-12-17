import { cn } from '@/utils/cn';
import { Input } from '@headlessui/react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>
  & {
    invalid?: boolean
  };

const CustomInput = ({ className, invalid, ...props }: InputProps) => {
  return (
    <Input
      className={cn(`
        flex h-9 w-full rounded-md border border-input bg-input-background px-3
        py-1 text-base transition-all outline-none
        selection:bg-primary selection:text-primary-foreground
        file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm
        file:font-medium file:text-foreground
        placeholder:text-muted-foreground
        disabled:pointer-events-none disabled:cursor-not-allowed
        disabled:opacity-50
        aria-invalid:border-destructive aria-invalid:ring-destructive/20
        data-focus:border-ring data-focus:ring-[3px] data-focus:ring-ring/50
        dark:bg-input/30 dark:aria-invalid:ring-destructive/40
      `, className)}
      area-invalid={invalid}
      {...props}
    />
  );
};
export default CustomInput;
