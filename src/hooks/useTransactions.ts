'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types';

const STORAGE_KEY = 'fin_transactions';

function loadFromStorage(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTransactions(loadFromStorage());
    setLoaded(true);
  }, []);

  const add = useCallback((transaction: Transaction) => {
    setTransactions((prev) => {
      const next = [...prev, transaction];
      saveToStorage(next);
      return next;
    });
  }, []);

  const update = useCallback((updated: Transaction) => {
    setTransactions((prev) => {
      const next = prev.map((t) => (t.id === updated.id ? updated : t));
      saveToStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setTransactions((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const getById = useCallback(
    (id: string): Transaction | undefined => {
      return transactions.find((t) => t.id === id);
    },
    [transactions],
  );

  return { transactions, loaded, add, update, remove, getById };
}
