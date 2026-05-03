import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionForm } from '@/views/TransactionForm';
import type { Transaction } from '@/types';

const onSave = jest.fn();
const onCancel = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

function fillValidEntrada() {
  fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Salário' } });
  fireEvent.change(screen.getByLabelText(/data/i), { target: { value: '15012025' } });
  fireEvent.change(screen.getByLabelText(/valor/i), { target: { value: '500000' } }); // R$ 5.000,00
}

function fillValidSaida() {
  fillValidEntrada();
  fireEvent.change(screen.getByLabelText(/categoria/i), { target: { value: 'Moradia' } });
}

describe('TransactionForm — modo criação (entrada)', () => {
  it('deve renderizar sem campo de categoria para entradas', () => {
    render(<TransactionForm type="entrada" onSave={onSave} onCancel={onCancel} />);
    expect(screen.queryByLabelText(/categoria/i)).not.toBeInTheDocument();
  });

  it('deve exibir título do formulário "Nova Entrada"', () => {
    render(<TransactionForm type="entrada" onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByText('Nova Entrada')).toBeInTheDocument();
  });

  it('ao tentar salvar com campos vazios, não deve chamar onSave', () => {
    render(<TransactionForm type="entrada" onSave={onSave} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /registrar entrada/i }));
    expect(onSave).not.toHaveBeenCalled();
  });

  it('deve exibir erro inline no título após blur sem valor', () => {
    render(<TransactionForm type="entrada" onSave={onSave} onCancel={onCancel} />);
    fireEvent.blur(screen.getByLabelText(/título/i));
    expect(screen.getAllByRole('alert')[0]).toBeInTheDocument();
  });

  it('ao preencher campos válidos e submeter, deve chamar onSave', () => {
    render(<TransactionForm type="entrada" onSave={onSave} onCancel={onCancel} />);
    fillValidEntrada();
    fireEvent.click(screen.getByRole('button', { name: /registrar entrada/i }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onSave com type="entrada" e sem category', () => {
    render(<TransactionForm type="entrada" onSave={onSave} onCancel={onCancel} />);
    fillValidEntrada();
    fireEvent.click(screen.getByRole('button', { name: /registrar entrada/i }));
    const saved: Transaction = onSave.mock.calls[0][0];
    expect(saved.type).toBe('entrada');
    expect(saved.category).toBeUndefined();
  });

  it('deve chamar onSave com id único (não vazio)', () => {
    render(<TransactionForm type="entrada" onSave={onSave} onCancel={onCancel} />);
    fillValidEntrada();
    fireEvent.click(screen.getByRole('button', { name: /registrar entrada/i }));
    const saved: Transaction = onSave.mock.calls[0][0];
    expect(saved.id).toBeTruthy();
  });

  it('deve chamar onCancel ao clicar em "Cancelar"', () => {
    render(<TransactionForm type="entrada" onSave={onSave} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

describe('TransactionForm — modo criação (saída)', () => {
  it('deve exibir campo de categoria como obrigatório para saídas', () => {
    render(<TransactionForm type="saida" onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
  });

  it('não deve chamar onSave se categoria não estiver selecionada', () => {
    render(<TransactionForm type="saida" onSave={onSave} onCancel={onCancel} />);
    fillValidEntrada(); // preenche tudo exceto categoria
    fireEvent.click(screen.getByRole('button', { name: /registrar saída/i }));
    expect(onSave).not.toHaveBeenCalled();
  });

  it('deve chamar onSave com categoria ao preencher formulário de saída válido', () => {
    render(<TransactionForm type="saida" onSave={onSave} onCancel={onCancel} />);
    fillValidSaida();
    fireEvent.click(screen.getByRole('button', { name: /registrar saída/i }));
    const saved: Transaction = onSave.mock.calls[0][0];
    expect(saved.category).toBe('Moradia');
    expect(saved.type).toBe('saida');
  });
});

describe('TransactionForm — modo edição', () => {
  const editingTransaction: Transaction = {
    id: 'edit-1',
    type: 'entrada',
    title: 'Freelance',
    description: 'Projeto web',
    date: '2025-03-15',
    amount: 2500,
  };

  it('deve pré-preencher o título com o valor da transação existente', () => {
    render(
      <TransactionForm
        type="entrada"
        editingTransaction={editingTransaction}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );
    const titleInput = screen.getByLabelText(/título/i) as HTMLInputElement;
    expect(titleInput.value).toBe('Freelance');
  });

  it('deve pré-preencher a descrição com o valor da transação existente', () => {
    render(
      <TransactionForm
        type="entrada"
        editingTransaction={editingTransaction}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );
    const descInput = screen.getByLabelText(/descrição/i) as HTMLTextAreaElement;
    expect(descInput.value).toBe('Projeto web');
  });

  it('deve pré-preencher a data no formato dd/mm/aaaa', () => {
    render(
      <TransactionForm
        type="entrada"
        editingTransaction={editingTransaction}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );
    const dateInput = screen.getByLabelText(/data/i) as HTMLInputElement;
    expect(dateInput.value).toBe('15/03/2025');
  });

  it('deve exibir título do formulário "Editar Entrada"', () => {
    render(
      <TransactionForm
        type="entrada"
        editingTransaction={editingTransaction}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );
    expect(screen.getByText('Editar Entrada')).toBeInTheDocument();
  });

  it('deve preservar o id original ao salvar edição', () => {
    render(
      <TransactionForm
        type="entrada"
        editingTransaction={editingTransaction}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );
    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Novo título' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar alterações/i }));
    const saved: Transaction = onSave.mock.calls[0][0];
    expect(saved.id).toBe('edit-1');
  });

  it('deve chamar onSave com o novo título ao editar', () => {
    render(
      <TransactionForm
        type="entrada"
        editingTransaction={editingTransaction}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );
    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Freelance atualizado' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar alterações/i }));
    const saved: Transaction = onSave.mock.calls[0][0];
    expect(saved.title).toBe('Freelance atualizado');
  });

  it('deve renderizar em modo criação quando editingTransaction é undefined (ID inexistente)', () => {
    render(
      <TransactionForm
        type="entrada"
        editingTransaction={undefined}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );
    // Sem editingTransaction, formulário abre em modo criação (sem erro de ID)
    expect(screen.getByText('Nova Entrada')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
