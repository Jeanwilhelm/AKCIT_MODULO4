'use client';

interface EmptyStateProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function EmptyState({ onAddIncome, onAddExpense }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-6xl mb-4">💰</div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Nenhum lançamento ainda</h2>
      <p className="text-gray-500 text-center mb-8 max-w-md">
        Comece registrando suas entradas e saídas para acompanhar sua saúde financeira.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onAddIncome}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
        >
          <span className="text-xl">+</span>
          Registrar Entrada
        </button>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
        >
          <span className="text-xl">−</span>
          Registrar Saída
        </button>
      </div>
    </div>
  );
}
