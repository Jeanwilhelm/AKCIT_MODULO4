'use client';

import { useMemo, useState } from 'react';
import { Transaction } from '@/types';
import { GlobalBalance } from '@/components/GlobalBalance';
import { YearFilter } from '@/components/YearFilter';
import { MonthSummaryRow } from '@/components/MonthSummaryRow';
import { EmptyState } from '@/components/EmptyState';
import { groupByMonth, getAvailableYears } from '@/lib/groupByMonth';

interface DashboardProps {
  transactions: Transaction[];
  onAddIncome: () => void;
  onAddExpense: () => void;
  onTransactionClick: (transaction: Transaction) => void;
}

export function Dashboard({
  transactions,
  onAddIncome,
  onAddExpense,
  onTransactionClick,
}: DashboardProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const availableYears = useMemo(() => getAvailableYears(transactions), [transactions]);
  const monthSummaries = useMemo(
    () => groupByMonth(transactions, selectedYear),
    [transactions, selectedYear],
  );

  const hasAnyTransactions = transactions.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Controle Financeiro</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddIncome}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>+</span> Entrada
            </button>
            <button
              onClick={onAddExpense}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              <span>−</span> Saída
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <GlobalBalance transactions={transactions} />

        {!hasAnyTransactions ? (
          <EmptyState onAddIncome={onAddIncome} onAddExpense={onAddExpense} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <YearFilter
                availableYears={availableYears}
                selectedYear={selectedYear}
                onChange={setSelectedYear}
              />
              <span className="text-sm text-gray-400">
                {monthSummaries.length === 0
                  ? 'Nenhum lançamento neste ano'
                  : `${monthSummaries.length} ${monthSummaries.length === 1 ? 'mês' : 'meses'}`}
              </span>
            </div>

            {monthSummaries.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">Nenhum lançamento em {selectedYear}</p>
                <p className="text-sm mt-1">Selecione outro ano ou registre um novo lançamento</p>
              </div>
            ) : (
              <div className="space-y-4">
                {monthSummaries.map((summary) => (
                  <MonthSummaryRow
                    key={`${summary.year}-${summary.month}`}
                    summary={summary}
                    onTransactionClick={onTransactionClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
