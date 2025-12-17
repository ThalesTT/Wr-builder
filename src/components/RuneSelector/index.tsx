import React, { useState, useEffect } from 'react';
import runesJson from '../../../public/data/new-runes.json';

// Tipo para as runas
export interface Rune {
  name: string;
  image: string;
  type: string; // Keystone, Domination, etc.
}
interface RuneCategory {
  [Key: string]: Rune[];
}

interface RunesSelectorProps {
  onSelectRunes: (selectedRunes: Rune[]) => void;
}

export const RunesSelector: React.FC<RunesSelectorProps> = ({
  onSelectRunes,
}) => {
  const [selectedRunes, setSelectedRunes] = useState<Rune[]>([]);
  const [runesData, setRunesData] = useState<RuneCategory[]>([]);

  useEffect(() => {
    const runas = runesJson.runas;
    setRunesData(runas);
  }, []);

  // Função para selecionar runas
  const handleRuneSelect = (rune: Rune) => {
    let updatedRunes = [...selectedRunes];

    if (rune.type === 'Keystone') {
      // Se for uma Keystone, somente uma pode ser selecionada
      updatedRunes = updatedRunes.filter(r => r.type !== 'Keystone');
      updatedRunes.push(rune);
    } else {
      // Para as outras runas (Domination, Precision, Resolve), somente uma pode ser selecionada de cada tipo
      if (!updatedRunes.some(r => r.type === rune.type)) {
        updatedRunes.push(rune);
      }
    }

    setSelectedRunes(updatedRunes);
    onSelectRunes(updatedRunes);
  };

  useEffect(() => {
    // Atualiza as runas no componente pai toda vez que a seleção mudar
    onSelectRunes(selectedRunes);
  }, [selectedRunes, onSelectRunes]);

  return (
    <div>
      <h3>Selecione as Runas</h3>

      {/* Renderizando todas as runas */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {runesData.map((category, index) => (
          <div key={index}>
            <h4>{Object.keys(category)[0]}</h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {category[Object.keys(category)[0]].map(rune => (
                <div
                  key={rune.name}
                  onClick={() => handleRuneSelect(rune)}
                  style={{
                    cursor: 'pointer',
                    border: selectedRunes.some(
                      selected => selected.name === rune.name,
                    )
                      ? '2px solid #ffcc00'
                      : '2px solid #ccc',
                    padding: '10px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={`/images/runes/${rune.image}`}
                    alt={rune.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'contain',
                      borderRadius: '4px',
                    }}
                  />
                  <span
                    style={{
                      color: selectedRunes.some(
                        selected => selected.name === rune.name,
                      )
                        ? '#ffcc00'
                        : '#000',
                    }}
                  >
                    {rune.name.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
