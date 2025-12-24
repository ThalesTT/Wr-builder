import { useAppData } from '../hooks/useAppData';
import type { Rune, SelectedRunes } from '../MainRouter/Router';

interface RunesDisplayProps {
  selectedRunes: SelectedRunes | null;
}

export function RunesDisplay({ selectedRunes }: RunesDisplayProps) {
  const { allRunesFlat } = useAppData();

  if (!selectedRunes) return null;

  // Função agora tipada: aceita a runa (objeto) ou o name técnico (string)
  const getRuneInfo = (input: Rune | string | null): Rune | undefined => {
    if (!input) return undefined;
    const techName = typeof input === 'string' ? input : input.name;
    return allRunesFlat.find(r => r.name === techName);
  };

  const RuneSlot = ({
    runeRaw,
    isKeystone = false,
  }: {
    runeRaw: Rune | string | null;
    isKeystone?: boolean;
  }) => {
    const info = getRuneInfo(runeRaw);
    if (!info) return null;

    return (
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            padding: '2px',
            borderRadius: '50%',
            background: isKeystone
              ? 'linear-gradient(45deg, #c4973e, #f9e392)'
              : 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <img
            src={`/images/runes/${info.name}.WEBP`}
            alt={info.nome}
            style={{
              width: isKeystone ? '44px' : '32px',
              height: isKeystone ? '44px' : '32px',
              display: 'block',
              borderRadius: '50%',
            }}
          />
        </div>
        <span
          style={{
            fontSize: '10px',
            color: isKeystone ? '#f9e392' : '#ccc',
            marginTop: '4px',
          }}
        >
          {info.nome}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <RuneSlot runeRaw={selectedRunes.keystone} isKeystone />

      <div
        style={{
          width: '1px',
          height: '30px',
          backgroundColor: 'rgba(255,255,255,0.1)',
        }}
      />

      <div style={{ display: 'flex', gap: '8px' }}>
        {Object.values(selectedRunes.secondary).map((rune, i) => (
          <RuneSlot key={i} runeRaw={rune} />
        ))}
        {selectedRunes.extra && <RuneSlot runeRaw={selectedRunes.extra} />}
      </div>
    </div>
  );
}
