import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionModal } from '@/components/TransactionModal';
import type { Transaction } from '@/types';

const entrada: Transaction = {
  id: 'modal-e',
  type: 'entrada',
  title: 'Salário mensal',
  description: 'Referente ao mês de março',
  date: '2025-03-05',
  amount: 5000,
};

const saida: Transaction = {
  id: 'modal-s',
  type: 'saida',
  title: 'Supermercado',
  date: '2025-03-10',
  amount: 450.90,
  category: 'Alimentação',
};

const saidaSemDescricao: Transaction = {
  id: 'modal-sd',
  type: 'saida',
  title: 'Uber',
  date: '2025-03-15',
  amount: 35,
  category: 'Transporte',
};

describe('TransactionModal — entrada', () => {
  it('deve exibir tipo "Entrada"', () => {
    render(
      <TransactionModal transaction={entrada} onClose={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText('Entrada')).toBeInTheDocument();
  });

  it('deve exibir o título da transação', () => {
    render(
      <TransactionModal transaction={entrada} onClose={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText('Salário mensal')).toBeInTheDocument();
  });

  it('deve exibir o valor formatado', () => {
    render(
      <TransactionModal transaction={entrada} onClose={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText(/5\.000,00/)).toBeInTheDocument();
  });

  it('deve exibir a data no formato dd/mm/aaaa', () => {
    render(
      <TransactionModal transaction={entrada} onClose={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText('05/03/2025')).toBeInTheDocument();
  });

  it('não deve exibir campo de categoria para entradas', () => {
    render(
      <TransactionModal transaction={entrada} onClose={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.queryByText('Alimentação')).not.toBeInTheDocument();
  });

  it('deve exibir descrição quando preenchida', () => {
    render(
      <TransactionModal transaction={entrada} onClose={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText('Referente ao mês de março')).toBeInTheDocument();
  });
});

describe('TransactionModal — saída', () => {
  it('deve exibir tipo "Saída"', () => {
    render(
      <TransactionModal transaction={saida} onClose={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText('Saída')).toBeInTheDocument();
  });

  it('deve exibir a categoria para saídas', () => {
    render(
      <TransactionModal transaction={saida} onClose={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText('Alimentação')).toBeInTheDocument();
  });

  it('deve ocultar campo de descrição quando descrição está vazia', () => {
    render(
      <TransactionModal transaction={saidaSemDescricao} onClose={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.queryByText('Descrição')).not.toBeInTheDocument();
  });
});

describe('TransactionModal — ações', () => {
  it('deve chamar onEdit ao clicar em "Editar"', () => {
    const onEdit = jest.fn();
    render(
      <TransactionModal transaction={saida} onClose={jest.fn()} onEdit={onEdit} onDelete={jest.fn()} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(saida);
  });

  it('deve chamar onDelete ao clicar em "Excluir"', () => {
    const onDelete = jest.fn();
    render(
      <TransactionModal transaction={saida} onClose={jest.fn()} onEdit={jest.fn()} onDelete={onDelete} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
    expect(onDelete).toHaveBeenCalledWith(saida);
  });

  it('deve chamar onClose ao clicar no botão X', () => {
    const onClose = jest.fn();
    render(
      <TransactionModal transaction={saida} onClose={onClose} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /fechar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar no backdrop', () => {
    const onClose = jest.fn();
    render(
      <TransactionModal transaction={saida} onClose={onClose} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
