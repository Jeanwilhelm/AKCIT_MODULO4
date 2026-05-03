'use client';

import { useEffect, useRef } from 'react';
import { Transaction } from '@/types';
import { cn } from '@/lib/cn';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface TransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionModal({
  transaction,
  onClose,
  onEdit,
  onDelete,
}: TransactionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  const isIncome = transaction.type === 'entrada';
  const typeLabel = isIncome ? 'Entrada' : 'Saída';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
            Detalhes do Lançamento
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Fechar"
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-semibold px-3 py-1 rounded-full',
                isIncome ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50',
              )}
            >
              {typeLabel}
            </span>
            {transaction.category && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {transaction.category}
              </span>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-0.5">Título</p>
            <p className="text-gray-800 font-medium">{transaction.title}</p>
          </div>

          {transaction.description && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Descrição</p>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{transaction.description}</p>
            </div>
          )}

          <div className="flex gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Data</p>
              <p className="text-gray-800">{formatDate(transaction.date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Valor</p>
              <p className={cn('font-semibold text-lg', isIncome ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button
            onClick={() => onEdit(transaction)}
            className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(transaction)}
            className="flex-1 py-2.5 px-4 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors border border-red-200"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
