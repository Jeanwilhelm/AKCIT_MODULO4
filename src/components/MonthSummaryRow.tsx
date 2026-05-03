'use client';

import { useMemo } from 'react';
import { Transaction } from '@/types';
import { cn } from '@/lib/cn';
import { MonthSummary, sortTransactionsInMonth } from '@/lib/groupByMonth';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface MonthSummaryRowProps {
  summary: MonthSummary;
  onTransactionClick: (transaction: Transaction) => void;
}

export function MonthSummaryRow({ summary, onTransactionClick }: MonthSummaryRowProps) {
  const { incomes, expenseGroups } = useMemo(
    () => sortTransactionsInMonth(summary.transactions),
    [summary.transactions],
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className={cn(
          'flex items-center justify-between px-5 py-3 border-b border-gray-100',
          summary.balance > 0 && 'bg-green-50',
          summary.balance < 0 && 'bg-red-50',
          summary.balance === 0 && 'bg-gray-50',
        )}
      >
        <h3 className="font-semibold text-gray-800 text-base">
          {summary.monthLabel} {summary.year}
        </h3>
        <div className="text-right">
          <p className="text-xs text-gray-500">Saldo do mês</p>
          <p
            className={cn(
              'font-bold text-lg',
              summary.balance > 0 && 'text-green-600',
              summary.balance < 0 && 'text-red-600',
              summary.balance === 0 && 'text-gray-600',
            )}
          >
            {formatCurrency(summary.balance)}
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {incomes.length > 0 && (
          <div className="px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                Entradas ({summary.incomeCount})
              </span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(summary.incomeTotal)}
              </span>
            </div>
            <ul className="space-y-1.5">
              {incomes.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onTransactionClick(t)}
                    className="w-full text-left flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-green-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-800 group-hover:text-green-800 truncate block">
                        {t.title}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(t.date)}</span>
                    </div>
                    <span className="text-sm font-medium text-green-600 ml-3 shrink-0">
                      {formatCurrency(t.amount)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {expenseGroups.length > 0 && (
          <div className="px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                Saídas
              </span>
              <span className="text-sm font-semibold text-red-600">
                {formatCurrency(summary.expenseTotal)}
              </span>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {summary.expensesByCategory.map(({ category, total }) => (
                <div key={category} className="bg-red-50 rounded-lg px-2.5 py-1.5">
                  <p className="text-xs text-gray-500 truncate">{category}</p>
                  <p className="text-sm font-semibold text-red-700">{formatCurrency(total)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {expenseGroups.map(({ category, transactions }) => (
                <div key={category}>
                  <p className="text-xs font-medium text-gray-500 mb-1 pl-2">{category}</p>
                  <ul className="space-y-1">
                    {transactions.map((t) => (
                      <li key={t.id}>
                        <button
                          onClick={() => onTransactionClick(t)}
                          className="w-full text-left flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-red-50 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-gray-800 group-hover:text-red-800 truncate block">
                              {t.title}
                            </span>
                            <span className="text-xs text-gray-400">{formatDate(t.date)}</span>
                          </div>
                          <span className="text-sm font-medium text-red-600 ml-3 shrink-0">
                            {formatCurrency(t.amount)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
