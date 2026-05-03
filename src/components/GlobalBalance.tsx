'use client';

import { useMemo } from 'react';
import { Transaction } from '@/types';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/formatters';

interface GlobalBalanceProps {
  transactions: Transaction[];
}

export function GlobalBalance({ transactions }: GlobalBalanceProps) {
  const { balance, incomeTotal, expenseTotal } = useMemo(() => {
    const incomeTotal = transactions
      .filter((t) => t.type === 'entrada')
      .reduce((s, t) => s + t.amount, 0);
    const expenseTotal = transactions
      .filter((t) => t.type === 'saida')
      .reduce((s, t) => s + t.amount, 0);
    return { balance: incomeTotal - expenseTotal, incomeTotal, expenseTotal };
  }, [transactions]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <p className="text-sm font-medium text-gray-500 mb-1">Saldo Acumulado Global</p>
      <p
        className={cn(
          'text-4xl font-bold',
          balance > 0 && 'text-green-600',
          balance < 0 && 'text-red-600',
          balance === 0 && 'text-gray-600',
        )}
      >
        {formatCurrency(balance)}
      </p>
      <div className="flex gap-6 mt-4">
        <div>
          <p className="text-xs text-gray-400">Total Entradas</p>
          <p className="text-base font-semibold text-green-600">{formatCurrency(incomeTotal)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total Saídas</p>
          <p className="text-base font-semibold text-red-600">{formatCurrency(expenseTotal)}</p>
        </div>
      </div>
    </div>
  );
}
