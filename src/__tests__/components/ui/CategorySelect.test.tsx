import { render, screen, fireEvent } from '@testing-library/react';
import { CategorySelect } from '@/components/ui/CategorySelect';
import type { Category } from '@/types';

const EXPECTED_CATEGORIES: Category[] = [
  'Alimentação',
  'Compras Pessoais',
  'Contas de Consumo',
  'Educação e Ensino',
  'Investimentos',
  'Lazer e Hobbies',
  'Moradia',
  'Outros',
  'Saúde',
  'Transporte',
];

describe('CategorySelect', () => {
  it('deve renderizar todas as 10 categorias como opções', () => {
    render(<CategorySelect value="" onChange={jest.fn()} />);
    const options = screen.getAllByRole('option');
    const categoryOptions = options.filter((o) => (o as HTMLOptionElement).value !== '');
    expect(categoryOptions).toHaveLength(10);
  });

  it('deve renderizar cada categoria com o texto correto', () => {
    render(<CategorySelect value="" onChange={jest.fn()} />);
    for (const cat of EXPECTED_CATEGORIES) {
      expect(screen.getByRole('option', { name: cat })).toBeInTheDocument();
    }
  });

  it('deve exibir placeholder quando nenhuma categoria está selecionada', () => {
    render(<CategorySelect value="" onChange={jest.fn()} />);
    expect(screen.getByRole('option', { name: 'Selecione uma categoria' })).toBeInTheDocument();
  });

  it('deve chamar onChange com o valor correto ao selecionar categoria', () => {
    const onChange = jest.fn();
    render(<CategorySelect value="" onChange={onChange} />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'Moradia' } });

    expect(onChange).toHaveBeenCalledWith('Moradia');
  });

  it('deve refletir a categoria selecionada via prop value', () => {
    render(<CategorySelect value="Saúde" onChange={jest.fn()} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('Saúde');
  });
});
