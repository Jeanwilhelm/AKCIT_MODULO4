export function validateTitle(value: string): string | null {
  if (!value.trim()) return 'Título é obrigatório';
  if (value.length > 300) return 'Título deve ter no máximo 300 caracteres';
  return null;
}

export function validateDescription(value: string): string | null {
  if (value.length > 3000) return 'Descrição deve ter no máximo 3.000 caracteres';
  return null;
}

export function validateDate(value: string): string | null {
  if (!value || value.length < 10) return 'Data é obrigatória';

  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return 'Data deve estar no formato dd/mm/aaaa';

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) return 'Mês inválido';
  if (day < 1) return 'Dia inválido';
  if (year < 1900 || year > 2100) return 'Ano inválido';

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return 'Data inválida';
  }

  return null;
}

export function validateAmount(value: string): string | null {
  if (!value) return 'Valor é obrigatório';

  const numeric = parseFloat(value.replace(/\./g, '').replace(',', '.'));
  if (isNaN(numeric) || numeric <= 0) return 'Valor deve ser maior que zero';
  if (numeric < 0.01) return 'Valor mínimo é R$ 0,01';
  if (numeric > 99999999) return 'Valor máximo é R$ 99.999.999,00';

  return null;
}
