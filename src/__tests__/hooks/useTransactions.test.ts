import { renderHook, act } from '@testing-library/react';
import { useTransactions } from '@/hooks/useTransactions';
import type { Transaction } from '@/types';

const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: `id-${Math.random()}`,
  type: 'entrada',
  title: 'Salário',
  date: '2025-01-15',
  amount: 5000,
  ...overrides,
});

describe('useTransactions — leitura inicial', () => {
  it('deve retornar array vazio quando localStorage está vazio', () => {
    const { result } = renderHook(() => useTransactions());
    expect(result.current.transactions).toHaveLength(0);
  });

  it('deve marcar loaded como true após montar', () => {
    const { result } = renderHook(() => useTransactions());
    expect(result.current.loaded).toBe(true);
  });

  it('deve carregar corretamente transações salvas no localStorage ao inicializar', () => {
    const stored: Transaction[] = [
      makeTransaction({ id: 'a', title: 'Freelance', amount: 1000 }),
      makeTransaction({ id: 'b', type: 'saida', title: 'Aluguel', amount: 1500, category: 'Moradia' }),
    ];
    localStorage.setItem('fin_transactions', JSON.stringify(stored));

    const { result } = renderHook(() => useTransactions());
    expect(result.current.transactions).toHaveLength(2);
    expect(result.current.transactions).toEqual(stored);
  });

  it('deve calcular saldo acumulado a partir das transações carregadas', () => {
    const stored: Transaction[] = [
      makeTransaction({ id: 'a', type: 'entrada', amount: 3000 }),
      makeTransaction({ id: 'b', type: 'saida', amount: 1000, category: 'Moradia' }),
    ];
    localStorage.setItem('fin_transactions', JSON.stringify(stored));

    const { result } = renderHook(() => useTransactions());
    const balance = result.current.transactions.reduce(
      (s, t) => s + (t.type === 'entrada' ? t.amount : -t.amount),
      0,
    );
    expect(balance).toBe(2000);
  });
});

describe('useTransactions — criação', () => {
  it('deve adicionar uma entrada válida e aumentar a lista em 1 item', () => {
    const { result } = renderHook(() => useTransactions());
    const tx = makeTransaction({ id: 'tx-1' });

    act(() => { result.current.add(tx); });

    expect(result.current.transactions).toHaveLength(1);
  });

  it('deve preservar todos os campos da entrada criada', () => {
    const { result } = renderHook(() => useTransactions());
    const tx = makeTransaction({ id: 'tx-2', title: 'Bônus', amount: 2500 });

    act(() => { result.current.add(tx); });

    expect(result.current.transactions[0]).toEqual(tx);
  });

  it('deve adicionar saída com categoria e persistir corretamente', () => {
    const { result } = renderHook(() => useTransactions());
    const tx = makeTransaction({ id: 'tx-3', type: 'saida', amount: 500, category: 'Alimentação' });

    act(() => { result.current.add(tx); });

    expect(result.current.transactions[0].category).toBe('Alimentação');
  });

  it('deve persistir no localStorage após adicionar', () => {
    const { result } = renderHook(() => useTransactions());
    const tx = makeTransaction({ id: 'tx-4' });

    act(() => { result.current.add(tx); });

    const stored = JSON.parse(localStorage.getItem('fin_transactions')!);
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual(tx);
  });

  it('deve ter lista com 3 itens após adicionar 3 transações', () => {
    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.add(makeTransaction({ id: 'a' }));
      result.current.add(makeTransaction({ id: 'b' }));
      result.current.add(makeTransaction({ id: 'c' }));
    });

    expect(result.current.transactions).toHaveLength(3);
  });
});

describe('useTransactions — atualização', () => {
  it('deve atualizar somente o título da transação editada', () => {
    const { result } = renderHook(() => useTransactions());
    const original = makeTransaction({ id: 'upd-1', title: 'Original' });

    act(() => { result.current.add(original); });
    act(() => { result.current.update({ ...original, title: 'Atualizado' }); });

    expect(result.current.transactions[0].title).toBe('Atualizado');
    expect(result.current.transactions).toHaveLength(1);
  });

  it('deve preservar campos intactos ao editar apenas o valor', () => {
    const { result } = renderHook(() => useTransactions());
    const original = makeTransaction({ id: 'upd-2', title: 'Fixo', amount: 100 });

    act(() => { result.current.add(original); });
    act(() => { result.current.update({ ...original, amount: 200 }); });

    const updated = result.current.transactions[0];
    expect(updated.amount).toBe(200);
    expect(updated.title).toBe('Fixo');
    expect(updated.date).toBe(original.date);
  });

  it('deve persistir edição de categoria no localStorage', () => {
    const { result } = renderHook(() => useTransactions());
    const original = makeTransaction({ id: 'upd-3', type: 'saida', category: 'Moradia' });

    act(() => { result.current.add(original); });
    act(() => { result.current.update({ ...original, category: 'Transporte' }); });

    const stored = JSON.parse(localStorage.getItem('fin_transactions')!);
    expect(stored[0].category).toBe('Transporte');
  });

  it('deve recalcular saldo quando valor é editado', () => {
    const { result } = renderHook(() => useTransactions());
    const tx = makeTransaction({ id: 'upd-4', type: 'entrada', amount: 1000 });

    act(() => { result.current.add(tx); });
    act(() => { result.current.update({ ...tx, amount: 2000 }); });

    const balance = result.current.transactions.reduce(
      (s, t) => s + (t.type === 'entrada' ? t.amount : -t.amount),
      0,
    );
    expect(balance).toBe(2000);
  });
});

describe('useTransactions — erro: atualização com ID inexistente', () => {
  it('não deve alterar a lista ao editar ID que não existe', () => {
    const { result } = renderHook(() => useTransactions());
    const tx = makeTransaction({ id: 'real-1' });

    act(() => { result.current.add(tx); });
    act(() => {
      result.current.update(makeTransaction({ id: 'fantasma', title: 'Não existe' }));
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].id).toBe('real-1');
  });

  it('não deve lançar exceção ao editar ID que não existe', () => {
    const { result } = renderHook(() => useTransactions());

    expect(() => {
      act(() => {
        result.current.update(makeTransaction({ id: 'inexistente' }));
      });
    }).not.toThrow();
  });
});

describe('useTransactions — exclusão', () => {
  it('deve reduzir a lista em 1 item após excluir', () => {
    const { result } = renderHook(() => useTransactions());
    const tx = makeTransaction({ id: 'del-1' });

    act(() => { result.current.add(tx); });
    act(() => { result.current.remove('del-1'); });

    expect(result.current.transactions).toHaveLength(0);
  });

  it('não deve incluir a transação excluída na lista', () => {
    const { result } = renderHook(() => useTransactions());
    const tx1 = makeTransaction({ id: 'del-a', title: 'A' });
    const tx2 = makeTransaction({ id: 'del-b', title: 'B' });

    act(() => {
      result.current.add(tx1);
      result.current.add(tx2);
    });
    act(() => { result.current.remove('del-a'); });

    const ids = result.current.transactions.map((t) => t.id);
    expect(ids).not.toContain('del-a');
    expect(ids).toContain('del-b');
  });

  it('deve atualizar o localStorage após excluir', () => {
    const { result } = renderHook(() => useTransactions());
    const tx = makeTransaction({ id: 'del-2' });

    act(() => { result.current.add(tx); });
    act(() => { result.current.remove('del-2'); });

    const stored = JSON.parse(localStorage.getItem('fin_transactions')!);
    expect(stored).toHaveLength(0);
  });

  it('deve recalcular saldo após excluir', () => {
    const { result } = renderHook(() => useTransactions());
    const entrada = makeTransaction({ id: 'del-e', type: 'entrada', amount: 5000 });
    const saida = makeTransaction({ id: 'del-s', type: 'saida', amount: 2000, category: 'Moradia' });

    act(() => {
      result.current.add(entrada);
      result.current.add(saida);
    });
    act(() => { result.current.remove('del-s'); });

    const balance = result.current.transactions.reduce(
      (s, t) => s + (t.type === 'entrada' ? t.amount : -t.amount),
      0,
    );
    expect(balance).toBe(5000);
  });
});

describe('useTransactions — erro: exclusão com ID inexistente', () => {
  it('não deve alterar a lista ao excluir ID que não existe', () => {
    const { result } = renderHook(() => useTransactions());
    const tx = makeTransaction({ id: 'real-2' });

    act(() => { result.current.add(tx); });
    act(() => { result.current.remove('id-fantasma'); });

    expect(result.current.transactions).toHaveLength(1);
  });

  it('não deve lançar exceção ao excluir ID que não existe', () => {
    const { result } = renderHook(() => useTransactions());

    expect(() => {
      act(() => { result.current.remove('inexistente'); });
    }).not.toThrow();
  });
});
