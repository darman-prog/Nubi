import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { content } from '@/core/content/content-repository';
import { ChainBuilder } from './ChainBuilder';

describe('ChainBuilder', () => {
  it('muestra 3 niveles de pistas, valida distractor y calcula el eslabón más débil al completar', () => {
    const chain = content.chainById('C-01');
    expect(chain).toBeDefined();
    if (!chain) return;

    const onSolved = vi.fn();
    render(<ChainBuilder chain={chain} onSolved={onSolved} />);

    // Distractor inicial muestra mensaje amable sin romper el progreso.
    const distractorLabel = content.nodeById('N-COLEGIO-TEMPRANO')?.label ?? 'N-COLEGIO-TEMPRANO';
    fireEvent.click(screen.getByRole('button', { name: new RegExp(distractorLabel, 'i') }));
    expect(screen.getByRole('status')).toHaveTextContent(/ese puente no conecta aquí/i);

    // Pistas progresivas 1 -> 2 -> 3.
    fireEvent.click(screen.getByRole('button', { name: /pedir pista/i }));
    expect(screen.getByText(/pista 1 de 3/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /otra pista \(1\/3\)/i }));
    expect(screen.getByText(/pista 2 de 3/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /otra pista \(2\/3\)/i }));
    expect(screen.getByText(/pista 3 de 3/i)).toBeInTheDocument();

    // Completa la cadena paso a paso.
    for (const nodeId of chain.solution.slice(1)) {
      const nodeLabel = content.nodeById(nodeId)?.label ?? nodeId;
      fireEvent.click(screen.getByRole('button', { name: new RegExp(nodeLabel, 'i') }));
    }

    expect(screen.getByText(/¡cadena completa!/i)).toBeInTheDocument();
    expect(screen.getByText(/eslabón más débil/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /reclamar sello/i }));
    expect(onSolved).toHaveBeenCalledOnce();
  });

  it('permite deshacer un paso y reiniciar la cadena', () => {
    const chain = content.chainById('C-01');
    expect(chain).toBeDefined();
    if (!chain) return;

    render(<ChainBuilder chain={chain} onSolved={() => {}} />);
    const secondLabel = content.nodeById(chain.solution[1])?.label ?? chain.solution[1];
    fireEvent.click(screen.getByRole('button', { name: new RegExp(secondLabel, 'i') }));

    expect(screen.getByRole('button', { name: /deshacer paso/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /deshacer paso/i }));
    expect(screen.queryByRole('button', { name: /deshacer paso/i })).not.toBeInTheDocument();
  });
});
