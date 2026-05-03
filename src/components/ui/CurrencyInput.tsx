'use client';

import { ChangeEvent } from 'react';
import { cn } from '@/lib/cn';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
}

export function CurrencyInput({ value, onChange, id, disabled }: CurrencyInputProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw === '') {
      onChange('');
      return;
    }

    const cents = parseInt(raw, 10);
    if (isNaN(cents)) return;
    if (cents > 9999999900) return;

    const reais = cents / 100;
    const formatted = reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    onChange(formatted);
  }

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-600 select-none pointer-events-none font-medium">
        R$
      </span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="0,00"
        className={cn(
          'w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg',
          'text-gray-900 placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
        )}
      />
    </div>
  );
}
