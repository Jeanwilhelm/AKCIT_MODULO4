export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function isoToDisplay(isoDate: string): string {
  return formatDate(isoDate);
}

export function displayToIso(displayDate: string): string {
  const [day, month, year] = displayDate.split('/');
  return `${year}-${month}-${day}`;
}
