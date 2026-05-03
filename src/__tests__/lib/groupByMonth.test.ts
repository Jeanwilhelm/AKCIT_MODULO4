import { groupByMonth, sortTransactionsInMonth } from '@/lib/groupByMonth';
import type { Transaction } from '@/types';

const TRANSACTIONS: Transaction[] = [
  // Janeiro 2025: entrada 5000, saídas Alimentação 500 + Moradia 1500
  { id: '1', type: 'entrada', title: 'Salário', date: '2025-01-05', amount: 5000 },
  { id: '2', type: 'saida', title: 'Aluguel', date: '2025-01-10', amount: 1500, category: 'Moradia' },
  { id: '3', type: 'saida', title: 'Mercado', date: '2025-01-20', amount: 300, category: 'Alimentação' },
  { id: '9', type: 'saida', title: 'Restaurante', date: '2025-01-15', amount: 200, category: 'Alimentação' },
  // Março 2025: saldo zero (entrada = saída = 2000)
  { id: '4', type: 'entrada', title: 'Freelance', date: '2025-03-01', amount: 2000 },
  { id: '5', type: 'saida', title: 'Curso', date: '2025-03-10', amount: 2000, category: 'Educação e Ensino' },
  // Dezembro 2025
  { id: '6', type: 'entrada', title: 'Bônus', date: '2025-12-01', amount: 3000 },
  { id: '7', type: 'saida', title: 'Presentes', date: '2025-12-15', amount: 1000, category: 'Compras Pessoais' },
  // 2024 (ano diferente)
  { id: '8', type: 'entrada', title: 'Salário 2024', date: '2024-06-01', amount: 4000 },
];

describe('groupByMonth', () => {
  it('deve agrupar corretamente transações do mesmo mês', () => {
    const result = groupByMonth(TRANSACTIONS, 2025);
    const janeiro = result.find((m) => m.month === 1)!;
    expect(janeiro.transactions).toHaveLength(4);
  });

  it('não deve incluir meses sem lançamentos', () => {
    const result = groupByMonth(TRANSACTIONS, 2025);
    const meses = result.map((m) => m.month);
    // Apenas janeiro (1), março (3) e dezembro (12) têm lançamentos
    expect(meses).not.toContain(2);
    expect(meses).not.toContain(4);
    expect(meses).toHaveLength(3);
  });

  it('deve incluir meses com saldo zero (entradas que cancelam saídas)', () => {
    const result = groupByMonth(TRANSACTIONS, 2025);
    const marco = result.find((m) => m.month === 3)!;
    expect(marco).toBeDefined();
    expect(marco.balance).toBe(0);
  });

  it('deve ordenar meses do mais recente para o mais antigo', () => {
    const result = groupByMonth(TRANSACTIONS, 2025);
    const meses = result.map((m) => m.month);
    expect(meses).toEqual([12, 3, 1]);
  });

  it('deve calcular corretamente o total de entradas por mês', () => {
    const result = groupByMonth(TRANSACTIONS, 2025);
    const janeiro = result.find((m) => m.month === 1)!;
    expect(janeiro.incomeTotal).toBe(5000);
  });

  it('deve calcular corretamente o total de saídas por mês', () => {
    const result = groupByMonth(TRANSACTIONS, 2025);
    const janeiro = result.find((m) => m.month === 1)!;
    expect(janeiro.expenseTotal).toBe(2000); // 1500 + 300 + 200
  });

  it('deve calcular corretamente o saldo do mês (entradas − saídas)', () => {
    const result = groupByMonth(TRANSACTIONS, 2025);
    const janeiro = result.find((m) => m.month === 1)!;
    expect(janeiro.balance).toBe(3000); // 5000 - 2000
  });

  it('deve agrupar saídas por categoria dentro de cada mês', () => {
    const result = groupByMonth(TRANSACTIONS, 2025);
    const janeiro = result.find((m) => m.month === 1)!;
    const categorias = janeiro.expensesByCategory.map((c) => c.category);
    expect(categorias).toContain('Alimentação');
    expect(categorias).toContain('Moradia');
  });

  it('deve ordenar categorias alfabeticamente dentro do mês', () => {
    const result = groupByMonth(TRANSACTIONS, 2025);
    const janeiro = result.find((m) => m.month === 1)!;
    const categorias = janeiro.expensesByCategory.map((c) => c.category);
    expect(categorias).toEqual(['Alimentação', 'Moradia']);
  });

  it('deve filtrar corretamente por ano (retornar apenas meses do ano solicitado)', () => {
    const result2024 = groupByMonth(TRANSACTIONS, 2024);
    expect(result2024).toHaveLength(1);
    expect(result2024[0].month).toBe(6);

    const result2025 = groupByMonth(TRANSACTIONS, 2025);
    expect(result2025).toHaveLength(3);
  });

  it('deve retornar array vazio para ano sem transações', () => {
    const result = groupByMonth(TRANSACTIONS, 2023);
    expect(result).toHaveLength(0);
  });
});

describe('sortTransactionsInMonth', () => {
  const janTransactions = TRANSACTIONS.filter((t) => t.date.startsWith('2025-01'));

  it('deve separar entradas de saídas', () => {
    const { incomes, expenseGroups } = sortTransactionsInMonth(janTransactions);
    expect(incomes).toHaveLength(1);
    expect(incomes[0].title).toBe('Salário');
    expect(expenseGroups).toHaveLength(2);
  });

  it('deve ordenar entradas por data decrescente', () => {
    const multipleIncomes: Transaction[] = [
      { id: 'a', type: 'entrada', title: 'A', date: '2025-01-10', amount: 100 },
      { id: 'b', type: 'entrada', title: 'B', date: '2025-01-25', amount: 200 },
      { id: 'c', type: 'entrada', title: 'C', date: '2025-01-05', amount: 300 },
    ];
    const { incomes } = sortTransactionsInMonth(multipleIncomes);
    expect(incomes.map((t) => t.id)).toEqual(['b', 'a', 'c']);
  });

  it('deve ordenar transações por data decrescente dentro de cada categoria', () => {
    const { expenseGroups } = sortTransactionsInMonth(janTransactions);
    const alimentacao = expenseGroups.find((g) => g.category === 'Alimentação')!;
    const datas = alimentacao.transactions.map((t) => t.date);
    expect(datas).toEqual(['2025-01-20', '2025-01-15']);
  });

  it('deve ordenar grupos de categorias alfabeticamente', () => {
    const { expenseGroups } = sortTransactionsInMonth(janTransactions);
    const cats = expenseGroups.map((g) => g.category);
    expect(cats).toEqual(['Alimentação', 'Moradia']);
  });
});
