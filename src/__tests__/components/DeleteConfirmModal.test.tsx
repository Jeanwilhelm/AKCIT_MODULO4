import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import type { Transaction } from '@/types';

const transaction: Transaction = {
  id: 'del-test',
  type: 'saida',
  title: 'Conta de luz',
  date: '2025-03-10',
  amount: 250.75,
  category: 'Contas de Consumo',
};

describe('DeleteConfirmModal', () => {
  it('deve exibir o título da transação na mensagem de confirmação', () => {
    render(
      <DeleteConfirmModal
        transaction={transaction}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    expect(screen.getByText('Conta de luz')).toBeInTheDocument();
  });

  it('deve exibir o valor formatado (R$ X,XX) na mensagem de confirmação', () => {
    render(
      <DeleteConfirmModal
        transaction={transaction}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    expect(screen.getByText(/250,75/)).toBeInTheDocument();
  });

  it('deve chamar onCancel ao clicar em "Cancelar"', () => {
    const onCancel = jest.fn();
    render(
      <DeleteConfirmModal transaction={transaction} onConfirm={jest.fn()} onCancel={onCancel} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onConfirm ao clicar em "Excluir"', () => {
    const onConfirm = jest.fn();
    render(
      <DeleteConfirmModal transaction={transaction} onConfirm={onConfirm} onCancel={jest.fn()} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onCancel ao clicar fora da modal (backdrop)', () => {
    const onCancel = jest.fn();
    render(
      <DeleteConfirmModal transaction={transaction} onConfirm={jest.fn()} onCancel={onCancel} />,
    );
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('não deve chamar onConfirm ao clicar no conteúdo da modal', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(
      <DeleteConfirmModal transaction={transaction} onConfirm={onConfirm} onCancel={onCancel} />,
    );
    // Clica no título da transação dentro da modal (não no backdrop)
    fireEvent.click(screen.getByText('Conta de luz'));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });
});
