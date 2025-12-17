import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

type Props<T> = { options?: T[], value: T, onChange: (option: T) => void };
// eslint-disable-next-line @stylistic/comma-dangle
const CustomListbox = <T extends string,>({ options, value, onChange }: Props<T>) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton
        className={`
          flex w-full items-center justify-between gap-2 rounded-md border
          border-input bg-input-background px-3 py-2 text-sm whitespace-nowrap
          transition-all outline-none
          focus-visible:border-ring focus-visible:ring-[3px]
          focus-visible:ring-ring/50
          disabled:cursor-not-allowed disabled:opacity-50
          dark:bg-input/30 dark:hover:bg-input/50
          dark:aria-invalid:ring-destructive/40
        `}
        disabled={!options || !options.length}
      >
        {value}
        <ChevronDown className="size-4 opacity-50" />
      </ListboxButton>
      <ListboxOptions
        transition
        anchor="bottom"
        className={`
          w-(--button-width) rounded-md border bg-popover
          text-popover-foreground shadow-md
        `}
      >
        {options?.map(option => (
          <ListboxOption
            key={option}
            value={option}
            className={`
              group relative flex w-full cursor-default items-center gap-2
              rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden
              data-focus:text-accent-foreground
            `}
          >
            {option}
            <Check className={`
              ml-auto hidden font-sans text-xs text-white/50
              group-data-selected:inline
            `}
            />
          </ListboxOption>
        )) }
      </ListboxOptions>
    </Listbox>
  );
};

export default CustomListbox;
