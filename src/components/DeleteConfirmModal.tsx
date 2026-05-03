'use client';

import { useEffect, useRef } from 'react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface DeleteConfirmModalProps {
  transaction: Transaction;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ transaction, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onCancel();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 id="delete-modal-title" className="text-lg font-semibold text-gray-800">
            Excluir Lançamento
          </h2>
        </div>

        <p className="text-gray-600 mb-2">Deseja realmente excluir este lançamento?</p>

        <div className="bg-gray-50 rounded-xl p-3 mb-5">
          <p className="text-sm font-medium text-gray-800">{transaction.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">{formatCurrency(transaction.amount)}</p>
        </div>

        <div className="flex gap-3">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
