import { render, screen } from '@testing-library/react';
import { CharCounter } from '@/components/ui/CharCounter';

describe('CharCounter', () => {
  it('deve exibir "0/300" para campo de título vazio', () => {
    render(<CharCounter current={0} max={300} />);
    expect(screen.getByText('0/300')).toBeInTheDocument();
  });

  it('deve exibir "5/300" ao ter 5 caracteres', () => {
    render(<CharCounter current={5} max={300} />);
    expect(screen.getByText('5/300')).toBeInTheDocument();
  });

  it('deve exibir contador em vermelho ao atingir o limite', () => {
    render(<CharCounter current={300} max={300} />);
    const counter = screen.getByText('300/300');
    expect(counter).toHaveClass('text-red-600');
  });

  it('não deve ter classe vermelha quando abaixo do limite', () => {
    render(<CharCounter current={100} max={300} />);
    const counter = screen.getByText('100/300');
    expect(counter).not.toHaveClass('text-red-600');
  });

  it('deve exibir contador em vermelho quando current > max', () => {
    render(<CharCounter current={301} max={300} />);
    const counter = screen.getByText('301/300');
    expect(counter).toHaveClass('text-red-600');
  });
});
