export type EntryType = 'entrada' | 'saida';

export type Category =
  | 'Alimentação'
  | 'Compras Pessoais'
  | 'Contas de Consumo'
  | 'Educação e Ensino'
  | 'Investimentos'
  | 'Lazer e Hobbies'
  | 'Moradia'
  | 'Outros'
  | 'Saúde'
  | 'Transporte';

export interface Transaction {
  id: string;
  type: EntryType;
  title: string;
  description?: string;
  date: string; // ISO 8601: yyyy-mm-dd
  amount: number;
  category?: Category;
}
