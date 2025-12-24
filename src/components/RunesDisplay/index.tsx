import type { SelectedRunes } from '../../types/Itens';

// Definindo as propriedades esperadas pelo componente
interface RunesDisplayProps {
  selectedRunes: SelectedRunes | null;
}

export function RunesDisplay({ selectedRunes }: RunesDisplayProps) {
  if (!selectedRunes) return null; // Caso não haja runas, não renderiza nada.

  return (
    <div
      style={{
        marginTop: '1rem',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      {/* Exibindo a Keystone */}
      {selectedRunes.keystone && (
        <div style={{ textAlign: 'center' }}>
          <img
            src={`/images/runes/${selectedRunes.keystone}.WEBP`}
            alt={selectedRunes.keystone}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '5px',
              border: '2px solid red',
            }}
          />
          <p style={{ color: 'white', fontSize: '0.75rem' }}>
            {selectedRunes.keystone}
          </p>
        </div>
      )}

      {/* Exibindo as runas secundárias */}
      {selectedRunes.secondary &&
        Object.values(selectedRunes.secondary).length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {Object.values(selectedRunes.secondary).map(
              (rune: string, index: number) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <img
                    src={`/images/runes/${rune}.WEBP`}
                    alt={rune}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '5px',
                    }}
                  />
                  <p style={{ color: 'white', fontSize: '0.75rem' }}>{rune}</p>
                </div>
              ),
            )}
          </div>
        )}

      {/* Exibindo a runa extra */}
      {selectedRunes.extra && (
        <div style={{ textAlign: 'center' }}>
          <img
            src={`/images/runes/${selectedRunes.extra}.WEBP`}
            alt={selectedRunes.extra}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '5px',
              border: '2px solid #fff',
            }}
          />
          <p style={{ color: 'white', fontSize: '0.75rem' }}>
            {selectedRunes.extra}
          </p>
        </div>
      )}
    </div>
  );
}
