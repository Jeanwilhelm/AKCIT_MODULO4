import { render, screen, fireEvent } from '@testing-library/react';
import { DateInput } from '@/components/ui/DateInput';

describe('DateInput', () => {
  it('deve aplicar máscara ao digitar "15042025" → chama onChange com "15/04/2025"', () => {
    const onChange = jest.fn();
    render(<DateInput value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '15042025' } });

    expect(onChange).toHaveBeenCalledWith('15/04/2025');
  });

  it('deve aplicar máscara parcial para 4 dígitos → "15/04"', () => {
    const onChange = jest.fn();
    render(<DateInput value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '1504' } });

    expect(onChange).toHaveBeenCalledWith('15/04');
  });

  it('deve aplicar máscara parcial para 2 dígitos → "15"', () => {
    const onChange = jest.fn();
    render(<DateInput value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '15' } });

    expect(onChange).toHaveBeenCalledWith('15');
  });

  it('deve exibir o valor passado via prop', () => {
    render(<DateInput value="15/04/2025" onChange={jest.fn()} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('15/04/2025');
  });

  it('deve ter maxLength 10 para comportar dd/mm/aaaa', () => {
    render(<DateInput value="" onChange={jest.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('deve ter placeholder "dd/mm/aaaa"', () => {
    render(<DateInput value="" onChange={jest.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'dd/mm/aaaa');
  });

  it('não deve exibir indicador de erro próprio (responsabilidade do pai)', () => {
    render(<DateInput value="" onChange={jest.fn()} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
