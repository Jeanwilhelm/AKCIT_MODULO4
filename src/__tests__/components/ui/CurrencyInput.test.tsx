import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencyInput } from '@/components/ui/CurrencyInput';

describe('CurrencyInput', () => {
  it('deve renderizar com label "R$" visível', () => {
    render(<CurrencyInput value="" onChange={jest.fn()} />);
    expect(screen.getByText('R$')).toBeInTheDocument();
  });

  it('deve chamar onChange com valor formatado ao digitar "125075"', () => {
    const onChange = jest.fn();
    render(<CurrencyInput value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '125075' } });

    expect(onChange).toHaveBeenCalledWith('1.250,75');
  });

  it('deve chamar onChange com "0,01" para entrada "1"', () => {
    const onChange = jest.fn();
    render(<CurrencyInput value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '1' } });

    expect(onChange).toHaveBeenCalledWith('0,01');
  });

  it('deve chamar onChange com string vazia ao limpar o campo', () => {
    const onChange = jest.fn();
    render(<CurrencyInput value="1.250,75" onChange={onChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '' } });

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('deve bloquear entrada acima do valor máximo sem chamar onChange', () => {
    const onChange = jest.fn();
    render(<CurrencyInput value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');

    // 10000000001 centavos = R$ 100.000.000,01, acima do limite de 9999999900
    fireEvent.change(input, { target: { value: '10000000001' } });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('deve exibir o valor passado via prop value', () => {
    render(<CurrencyInput value="1.250,75" onChange={jest.fn()} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('1.250,75');
  });

  it('deve renderizar com placeholder "0,00" quando sem valor', () => {
    render(<CurrencyInput value="" onChange={jest.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', '0,00');
  });
});
