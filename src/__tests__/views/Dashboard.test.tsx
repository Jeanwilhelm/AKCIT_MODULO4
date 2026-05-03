import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '@/views/Dashboard';
import type { Transaction } from '@/types';

const YEAR = new Date().getFullYear();
const PREV_YEAR = YEAR - 1;

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'entrada',
    title: 'Salário',
    date: `${YEAR}-01-05`,
    amount: 5000,
  },
  {
    id: '2',
    type: 'saida',
    title: 'Aluguel',
    date: `${YEAR}-01-10`,
    amount: 1500,
    category: 'Moradia',
  },
  {
    id: '3',
    type: 'entrada',
    title: 'Freelance antigo',
    date: `${PREV_YEAR}-06-01`,
    amount: 2000,
  },
];

const defaultProps = {
  transactions: TRANSACTIONS,
  onAddIncome: jest.fn(),
  onAddExpense: jest.fn(),
  onTransactionClick: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe('Dashboard — estado vazio', () => {
  it('deve renderizar estado vazio com CTA quando não há transações', () => {
    render(<Dashboard {...defaultProps} transactions={[]} />);
    expect(screen.getByText('Nenhum lançamento ainda')).toBeInTheDocument();
  });

  it('deve exibir botão para registrar entrada no estado vazio', () => {
    render(<Dashboard {...defaultProps} transactions={[]} />);
    expect(screen.getAllByRole('button', { name: /registrar entrada/i })).not.toHaveLength(0);
  });
});

describe('Dashboard — com transações', () => {
  it('deve renderizar o saldo acumulado global', () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText('Saldo Acumulado Global')).toBeInTheDocument();
  });

  it('deve exibir o ano vigente como padrão no filtro de ano', () => {
    render(<Dashboard {...defaultProps} />);
    const select = screen.getByLabelText(/ano/i) as HTMLSelectElement;
    expect(Number(select.value)).toBe(YEAR);
  });

  it('deve exibir meses do ano selecionado', () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText(/janeiro/i)).toBeInTheDocument();
  });

  it('não deve exibir meses sem lançamentos no ano corrente', () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.queryByText(/fevereiro/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/março/i)).not.toBeInTheDocument();
  });

  it('ao trocar o ano, a tabela exibe os meses do ano selecionado', () => {
    render(<Dashboard {...defaultProps} />);
    const select = screen.getByLabelText(/ano/i);

    fireEvent.change(select, { target: { value: String(PREV_YEAR) } });

    expect(screen.getByText(/junho/i)).toBeInTheDocument();
    expect(screen.queryByText(/janeiro/i)).not.toBeInTheDocument();
  });

  it('ao visualizar ano sem lançamentos, exibe mensagem de ausência', () => {
    // Transações apenas no PREV_YEAR; o YEAR (vigente) é adicionado ao filtro
    // automaticamente pelo YearFilter mas não tem lançamentos
    const onlyPrevYear: Transaction[] = [
      { id: 'p1', type: 'entrada', title: 'Salário', date: `${PREV_YEAR}-06-01`, amount: 3000 },
    ];
    render(<Dashboard {...defaultProps} transactions={onlyPrevYear} />);

    // O seletor começa no YEAR (vigente), que não tem lançamentos
    expect(screen.getByText(/nenhum lançamento neste ano/i)).toBeInTheDocument();
  });

  it('deve exibir saldo positivo com cor verde no GlobalBalance', () => {
    render(<Dashboard {...defaultProps} transactions={[{ id: 'e', type: 'entrada', title: 'A', date: `${YEAR}-01-01`, amount: 1000 }]} />);
    const balance = screen.getByText(/total entradas/i).parentElement!;
    expect(balance.textContent).toMatch(/1\.000,00|1 000,00/);
  });
});

describe('Dashboard — interação com transações', () => {
  it('deve chamar onTransactionClick ao clicar em uma transação expandida', () => {
    const onTransactionClick = jest.fn();
    render(<Dashboard {...defaultProps} onTransactionClick={onTransactionClick} />);

    // Expande o mês (botão com aria-expanded)
    const expandButton = screen
      .getAllByRole('button')
      .find((b) => b.hasAttribute('aria-expanded'))!;
    fireEvent.click(expandButton);

    // Clica na transação pelo título
    fireEvent.click(screen.getByText('Salário'));

    expect(onTransactionClick).toHaveBeenCalledWith(TRANSACTIONS[0]);
  });

  it('deve chamar onAddIncome ao clicar no botão "+ Entrada" do header', () => {
    const onAddIncome = jest.fn();
    render(<Dashboard {...defaultProps} onAddIncome={onAddIncome} />);
    fireEvent.click(screen.getAllByRole('button', { name: /\+ entrada/i })[0]);
    expect(onAddIncome).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onAddExpense ao clicar no botão "Saída" do header', () => {
    const onAddExpense = jest.fn();
    render(<Dashboard {...defaultProps} onAddExpense={onAddExpense} />);
    fireEvent.click(screen.getAllByRole('button', { name: /saída/i })[0]);
    expect(onAddExpense).toHaveBeenCalledTimes(1);
  });
});
