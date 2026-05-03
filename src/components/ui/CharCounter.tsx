'use client';

import { cn } from '@/lib/cn';

interface CharCounterProps {
  current: number;
  max: number;
}

export function CharCounter({ current, max }: CharCounterProps) {
  const remaining = max - current;

  return (
    <span
      className={cn(
        'text-xs',
        remaining <= 0 && 'text-red-600 font-medium',
        remaining > 0 && remaining <= max * 0.1 && 'text-amber-600',
        remaining > max * 0.1 && 'text-gray-400',
      )}
    >
      {current.toLocaleString('pt-BR')}/{max.toLocaleString('pt-BR')}
    </span>
  );
}
