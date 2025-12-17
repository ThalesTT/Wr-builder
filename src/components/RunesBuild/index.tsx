import React, { useState } from 'react';
import { RunesSelector, type Rune } from '../RuneSelector';

export const RunesBuild: React.FC = () => {
  const [selectedRunes, setSelectedRunes] = useState<Rune[]>([]);

  // Função para receber as runas selecionadas
  const handleRunesSelection = (runes: Rune[]) => {
    setSelectedRunes(runes); // Atualiza o estado com as runas selecionadas
  };

  return (
    <div>
      <h1>Editor de Build</h1>

      {/* Componente para selecionar as runas */}
      <RunesSelector onSelectRunes={handleRunesSelection} />

      {/* Exibição das runas selecionadas */}
      <div style={{ marginTop: '20px' }}>
        <h3>Runas Selecionadas:</h3>
        <ul>
          {selectedRunes.map((rune, index) => (
            <li key={index}>
              <img
                src={`/images/runes/${rune.image}`}
                alt={rune.name}
                style={{ width: '30px', height: '30px', marginRight: '10px' }}
              />
              {rune.name.replace(/_/g, ' ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
