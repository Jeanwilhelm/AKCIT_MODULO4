import { Transaction, Category } from '@/types';

export interface CategorySummary {
  category: Category;
  total: number;
  count: number;
}

export interface MonthSummary {
  year: number;
  month: number; // 1–12
  monthLabel: string;
  incomeCount: number;
  incomeTotal: number;
  expenseTotal: number;
  expensesByCategory: CategorySummary[];
  balance: number;
  transactions: Transaction[];
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function groupByMonth(
  transactions: Transaction[],
  year: number,
): MonthSummary[] {
  const filtered = transactions.filter((t) => {
    const [y] = t.date.split('-').map(Number);
    return y === year;
  });

  const map = new Map<number, Transaction[]>();
  for (const t of filtered) {
    const [, m] = t.date.split('-').map(Number);
    if (!map.has(m)) map.set(m, []);
    map.get(m)!.push(t);
  }

  const result: MonthSummary[] = [];

  for (const [month, txs] of map.entries()) {
    const incomes = txs.filter((t) => t.type === 'entrada');
    const expenses = txs.filter((t) => t.type === 'saida');

    const incomeTotal = incomes.reduce((s, t) => s + t.amount, 0);
    const expenseTotal = expenses.reduce((s, t) => s + t.amount, 0);

    const categoryMap = new Map<Category, { total: number; count: number }>();
    for (const t of expenses) {
      const cat = t.category!;
      const existing = categoryMap.get(cat) ?? { total: 0, count: 0 };
      categoryMap.set(cat, { total: existing.total + t.amount, count: existing.count + 1 });
    }

    const expensesByCategory: CategorySummary[] = Array.from(categoryMap.entries())
      .map(([category, { total, count }]) => ({ category, total, count }))
      .sort((a, b) => a.category.localeCompare(b.category, 'pt-BR'));

    result.push({
      year,
      month,
      monthLabel: MONTH_NAMES[month - 1],
      incomeCount: incomes.length,
      incomeTotal,
      expenseTotal,
      expensesByCategory,
      balance: incomeTotal - expenseTotal,
      transactions: txs,
    });
  }

  return result.sort((a, b) => b.month - a.month);
}

export function getAvailableYears(transactions: Transaction[]): number[] {
  const years = new Set<number>();
  for (const t of transactions) {
    const [y] = t.date.split('-').map(Number);
    years.add(y);
  }
  return Array.from(years).sort((a, b) => b - a);
}

export function sortTransactionsInMonth(transactions: Transaction[]): {
  incomes: Transaction[];
  expenseGroups: { category: Category; transactions: Transaction[] }[];
} {
  const incomes = transactions
    .filter((t) => t.type === 'entrada')
    .sort((a, b) => b.date.localeCompare(a.date));

  const expenses = transactions.filter((t) => t.type === 'saida');
  const catMap = new Map<Category, Transaction[]>();
  for (const t of expenses) {
    const cat = t.category!;
    if (!catMap.has(cat)) catMap.set(cat, []);
    catMap.get(cat)!.push(t);
  }

  const expenseGroups = Array.from(catMap.entries())
    .map(([category, txs]) => ({
      category,
      transactions: txs.sort((a, b) => b.date.localeCompare(a.date)),
    }))
    .sort((a, b) => a.category.localeCompare(b.category, 'pt-BR'));

  return { incomes, expenseGroups };
}
