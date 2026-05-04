'use client';

import { useState } from 'react';
import { Transaction, EntryType, Category } from '@/types';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { DateInput } from '@/components/ui/DateInput';
import { CategorySelect } from '@/components/ui/CategorySelect';
import { CharCounter } from '@/components/ui/CharCounter';
import { cn } from '@/lib/cn';
import { validateTitle, validateDescription, validateDate, validateAmount } from '@/lib/validators';
import { displayToIso, isoToDisplay } from '@/lib/formatters';

interface TransactionFormProps {
  type: EntryType;
  editingTransaction?: Transaction;
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function amountToDisplay(amount: number): string {
  return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function displayToAmount(display: string): number {
  return parseFloat(display.replace(/\./g, '').replace(',', '.')) || 0;
}

export function TransactionForm({ type, editingTransaction, onSave, onCancel }: TransactionFormProps) {
  const isEditing = !!editingTransaction;
  const typeLabel = type === 'entrada' ? 'Entrada' : 'Saída';

  const [title, setTitle] = useState(() => editingTransaction?.title ?? '');
  const [description, setDescription] = useState(() => editingTransaction?.description ?? '');
  const [date, setDate] = useState(() => editingTransaction ? isoToDisplay(editingTransaction.date) : '');
  const [amount, setAmount] = useState(() => editingTransaction ? amountToDisplay(editingTransaction.amount) : '');
  const [category, setCategory] = useState<Category | ''>(() => editingTransaction?.category ?? '');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    const titleErr = validateTitle(title);
    if (titleErr) errs.title = titleErr;

    const descErr = validateDescription(description);
    if (descErr) errs.description = descErr;

    const dateErr = validateDate(date);
    if (dateErr) errs.date = dateErr;

    const amountErr = validateAmount(amount);
    if (amountErr) errs.amount = amountErr;

    if (type === 'saida' && !category) {
      errs.category = 'Categoria é obrigatória para saídas';
    }

    return errs;
  }

  const currentErrors = validate();
  const hasErrors = Object.keys(currentErrors).length > 0;

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function getError(field: string): string | undefined {
    return touched[field] ? currentErrors[field] : undefined;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ title: true, description: true, date: true, amount: true, category: true });
    if (hasErrors) return;

    const transaction: Transaction = {
      id: editingTransaction?.id ?? generateId(),
      type,
      title: title.trim(),
      description: description.trim() || undefined,
      date: displayToIso(date),
      amount: displayToAmount(amount),
      category: type === 'saida' ? (category as Category) : undefined,
    };

    onSave(transaction);
  }

  const headerColor = type === 'entrada' ? 'bg-green-600' : 'bg-red-600';
  const accentColor = type === 'entrada' ? 'focus:ring-green-500' : 'focus:ring-red-500';
  const buttonColor =
    type === 'entrada' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${headerColor} px-6 py-5`}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Voltar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white text-lg font-semibold">
            {isEditing ? `Editar ${typeLabel}` : `Nova ${typeLabel}`}
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Título */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título <span className="text-red-500">*</span>
              </label>
              <CharCounter current={title.length} max={300} />
            </div>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 300))}
              onBlur={() => touch('title')}
              maxLength={300}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent',
                'text-gray-900 placeholder:text-gray-400',
                accentColor,
                getError('title') ? 'border-red-400 bg-red-50' : 'border-gray-300',
              )}
              placeholder="Nome do lançamento"
            />
            {getError('title') && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {getError('title')}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <CharCounter current={description.length} max={3000} />
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 3000))}
              onBlur={() => touch('description')}
              maxLength={3000}
              rows={3}
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none',
                'text-gray-900 placeholder:text-gray-400',
                accentColor,
                getError('description') ? 'border-red-400 bg-red-50' : 'border-gray-300',
              )}
              placeholder="Observações adicionais (opcional)"
            />
            {getError('description') && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {getError('description')}
              </p>
            )}
          </div>

          {/* Data */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Data <span className="text-red-500">*</span>
            </label>
            <DateInput id="date" value={date} onChange={setDate} />
            {touched.date && getError('date') && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {getError('date')}
              </p>
            )}
          </div>

          {/* Valor */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Valor <span className="text-red-500">*</span>
            </label>
            <CurrencyInput id="amount" value={amount} onChange={setAmount} />
            {touched.amount && getError('amount') && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {getError('amount')}
              </p>
            )}
          </div>

          {/* Categoria (apenas saídas) */}
          {type === 'saida' && (
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria <span className="text-red-500">*</span>
              </label>
              <CategorySelect id="category" value={category} onChange={setCategory} />
              {touched.category && getError('category') && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {getError('category')}
                </p>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 px-4 text-white font-semibold rounded-xl transition-colors ${buttonColor}`}
            >
              {isEditing ? 'Salvar alterações' : `Registrar ${typeLabel}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
