'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
  value?: string;
}

export function Select({ options, onValueChange, placeholder = 'Select an option', value, className, ...props }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || '');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === (value !== undefined ? value : internalValue));

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    setInternalValue(val);
    if (onValueChange) onValueChange(val);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <div
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-primary ring-offset-background placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-colors hover:bg-white/10",
          isOpen && "border-primary/50 ring-2 ring-primary/20"
        )}
        role="combobox"
        aria-controls="select-options"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn("truncate", !selectedOption && "text-text-muted")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            id="select-options"
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-white/10 bg-[#1C1C28]/95 p-1 text-text-primary shadow-xl backdrop-blur-xl"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none hover:bg-white/10 hover:text-white transition-colors cursor-pointer",
                  (value !== undefined ? value === option.value : internalValue === option.value) && "bg-primary/10 text-primary-400 font-medium"
                )}
                onClick={() => handleSelect(option.value)}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {(value !== undefined ? value === option.value : internalValue === option.value) && (
                    <Check className="h-4 w-4" />
                  )}
                </span>
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hidden native select for form compatibility if needed */}
      <select
        className="hidden"
        value={value !== undefined ? value : internalValue}
        onChange={(e) => handleSelect(e.target.value)}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}
