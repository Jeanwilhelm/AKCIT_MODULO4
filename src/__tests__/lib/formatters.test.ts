import { formatCurrency, formatDate } from '@/lib/formatters';

describe('formatCurrency', () => {
  it('deve conter "R$" e "1.250,75" para o valor 1250.75', () => {
    const result = formatCurrency(1250.75);
    expect(result).toContain('R$');
    expect(result).toContain('1.250,75');
  });

  it('deve conter "0,01" para o valor 0.01', () => {
    const result = formatCurrency(0.01);
    expect(result).toContain('R$');
    expect(result).toContain('0,01');
  });

  it('deve conter "99.999.999,00" para o valor máximo', () => {
    const result = formatCurrency(99999999);
    expect(result).toContain('R$');
    expect(result).toContain('99.999.999,00');
  });

  it('não deve usar formato en-US (vírgula como separador de milhar)', () => {
    const result = formatCurrency(1250.75);
    expect(result).not.toMatch(/1,250/);
  });
});

describe('formatDate', () => {
  it('deve converter 2025-04-15 para 15/04/2025', () => {
    expect(formatDate('2025-04-15')).toBe('15/04/2025');
  });

  it('deve converter 2025-01-01 para 01/01/2025', () => {
    expect(formatDate('2025-01-01')).toBe('01/01/2025');
  });
});
