'use client';

import { ChangeEvent } from 'react';
import { cn } from '@/lib/cn';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
}

export function DateInput({ value, onChange, id, disabled }: DateInputProps) {
  function applyMask(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(applyMask(e.target.value));
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder="dd/mm/aaaa"
      maxLength={10}
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-lg',
        'text-gray-900 placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
      )}
    />
  );
}
