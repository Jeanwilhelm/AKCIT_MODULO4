'use client';

import { useState } from 'react';
import { Transaction, EntryType } from '@/types';
import { useTransactions } from '@/hooks/useTransactions';
import { Dashboard } from '@/views/Dashboard';
import { TransactionForm } from '@/views/TransactionForm';
import { TransactionModal } from '@/components/TransactionModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';

type View =
  | { screen: 'dashboard' }
  | { screen: 'form'; type: EntryType; editing?: Transaction };

export function App() {
  const { transactions, loaded, add, update, remove } = useTransactions();
  const [view, setView] = useState<View>({ screen: 'dashboard' });
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  function handleSave(transaction: Transaction) {
    if (view.screen === 'form' && view.editing) {
      update(transaction);
    } else {
      add(transaction);
    }
    setView({ screen: 'dashboard' });
  }

  function handleEdit(transaction: Transaction) {
    setViewingTransaction(null);
    setView({ screen: 'form', type: transaction.type, editing: transaction });
  }

  function handleDeleteRequest(transaction: Transaction) {
    setViewingTransaction(null);
    setDeletingTransaction(transaction);
  }

  function handleDeleteConfirm() {
    if (deletingTransaction) {
      remove(deletingTransaction.id);
      setDeletingTransaction(null);
    }
  }

  if (view.screen === 'form') {
    return (
      <TransactionForm
        type={view.type}
        editingTransaction={view.editing}
        onSave={handleSave}
        onCancel={() => setView({ screen: 'dashboard' })}
      />
    );
  }

  return (
    <>
      <Dashboard
        transactions={transactions}
        onAddIncome={() => setView({ screen: 'form', type: 'entrada' })}
        onAddExpense={() => setView({ screen: 'form', type: 'saida' })}
        onTransactionClick={(t) => setViewingTransaction(t)}
      />

      {viewingTransaction && (
        <TransactionModal
          transaction={viewingTransaction}
          onClose={() => setViewingTransaction(null)}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      )}

      {deletingTransaction && (
        <DeleteConfirmModal
          transaction={deletingTransaction}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingTransaction(null)}
        />
      )}
    </>
  );
}
