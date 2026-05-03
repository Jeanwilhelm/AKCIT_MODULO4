'use client';

import { cn } from '@/lib/cn';
import { Category } from '@/types';

const CATEGORIES: Category[] = [
  'Alimentação',
  'Compras Pessoais',
  'Contas de Consumo',
  'Educação e Ensino',
  'Investimentos',
  'Lazer e Hobbies',
  'Moradia',
  'Outros',
  'Saúde',
  'Transporte',
];

interface CategorySelectProps {
  value: Category | '';
  onChange: (value: Category) => void;
  id?: string;
  disabled?: boolean;
}

export function CategorySelect({ value, onChange, id, disabled }: CategorySelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as Category)}
      disabled={disabled}
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white',
        'text-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
      )}
    >
      <option value="">Selecione uma categoria</option>
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
