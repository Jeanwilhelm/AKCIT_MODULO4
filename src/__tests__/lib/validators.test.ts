import {
  validateTitle,
  validateDescription,
  validateDate,
  validateAmount,
} from '@/lib/validators';

describe('validateTitle', () => {
  it('deve aceitar título com letras simples', () => {
    expect(validateTitle('Salário')).toBeNull();
  });

  it('deve aceitar título com acentos', () => {
    expect(validateTitle('Pagamento de água, gás e árvore')).toBeNull();
  });

  it('deve aceitar título com caracteres especiais permitidos', () => {
    expect(validateTitle('Nota fiscal (02/2025) - ref. @empresa!')).toBeNull();
  });

  it('deve aceitar título com exatamente 300 caracteres', () => {
    expect(validateTitle('a'.repeat(300))).toBeNull();
  });

  it('deve rejeitar título com 301 caracteres', () => {
    expect(validateTitle('a'.repeat(301))).not.toBeNull();
  });

  it('deve rejeitar título vazio', () => {
    expect(validateTitle('')).not.toBeNull();
  });

  it('deve rejeitar título com apenas espaços', () => {
    expect(validateTitle('   ')).not.toBeNull();
  });
});

describe('validateDescription', () => {
  it('deve aceitar descrição vazia (campo opcional)', () => {
    expect(validateDescription('')).toBeNull();
  });

  it('deve aceitar descrição com exatamente 3000 caracteres', () => {
    expect(validateDescription('a'.repeat(3000))).toBeNull();
  });

  it('deve rejeitar descrição com 3001 caracteres', () => {
    expect(validateDescription('a'.repeat(3001))).not.toBeNull();
  });
});

describe('validateDate', () => {
  it('deve aceitar data válida no formato dd/mm/aaaa', () => {
    expect(validateDate('15/04/2025')).toBeNull();
  });

  it('deve rejeitar dia impossível (32/01/2025)', () => {
    expect(validateDate('32/01/2025')).not.toBeNull();
  });

  it('deve rejeitar mês impossível (01/13/2025)', () => {
    expect(validateDate('01/13/2025')).not.toBeNull();
  });

  it('deve rejeitar fevereiro com dia inválido (31/02/2025)', () => {
    expect(validateDate('31/02/2025')).not.toBeNull();
  });

  it('deve aceitar 29/02 em ano bissexto (2024)', () => {
    expect(validateDate('29/02/2024')).toBeNull();
  });

  it('deve rejeitar 29/02 em ano não bissexto (2025)', () => {
    expect(validateDate('29/02/2025')).not.toBeNull();
  });

  it('deve rejeitar formato ISO (2025-04-15)', () => {
    expect(validateDate('2025-04-15')).not.toBeNull();
  });

  it('deve rejeitar formato com hífens (15-04-2025)', () => {
    expect(validateDate('15-04-2025')).not.toBeNull();
  });

  it('deve rejeitar string vazia', () => {
    expect(validateDate('')).not.toBeNull();
  });
});

describe('validateAmount', () => {
  it('deve aceitar R$ 0,01 (valor mínimo)', () => {
    expect(validateAmount('0,01')).toBeNull();
  });

  it('deve aceitar R$ 99.999.999,00 (valor máximo)', () => {
    expect(validateAmount('99.999.999,00')).toBeNull();
  });

  it('deve rejeitar R$ 0,00 (zero)', () => {
    expect(validateAmount('0,00')).not.toBeNull();
  });

  it('deve rejeitar valor negativo', () => {
    expect(validateAmount('-1,00')).not.toBeNull();
  });

  it('deve rejeitar valor acima de R$ 99.999.999,00', () => {
    expect(validateAmount('99.999.999,01')).not.toBeNull();
  });

  it('deve rejeitar string vazia', () => {
    expect(validateAmount('')).not.toBeNull();
  });

  it('deve rejeitar string não numérica', () => {
    expect(validateAmount('abc')).not.toBeNull();
  });
});
