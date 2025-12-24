import { useEffect, useMemo, useState } from 'react';
import runesDataImport from '../../data/runas.json';
import styles from './styles.module.css';

// --- Interfaces ---
export interface SelectedRunes {
  keystone: string | null;
  secondaryTreeId: string;
  secondary: Record<number, string>;
  extra: string | null;
}

interface Rune {
  name: string;
  nome: string;
  tier?: number;
}

interface RunesJson {
  keystones: Rune[];
  Domination: Rune[];
  Inspiration: Rune[];
  Precision: Rune[];
  Resolve: Rune[];
}

interface RunesProps {
  onUpdate: (runes: SelectedRunes) => void;
  initialRunes?: SelectedRunes;
}

export function Runes({ onUpdate, initialRunes }: RunesProps) {
  const data = runesDataImport as RunesJson;
  const treeIds = useMemo(
    () =>
      (Object.keys(data) as Array<keyof RunesJson>).filter(
        key => key !== 'keystones',
      ),
    [data],
  );

  const [selectedKeystone, setSelectedKeystone] = useState<string | null>(
    initialRunes?.keystone || null,
  );
  const [activeSecondaryTreeId, setActiveSecondaryTreeId] = useState<
    keyof RunesJson
  >((initialRunes?.secondaryTreeId as keyof RunesJson) || treeIds[0]);
  const [selectedSecondary, setSelectedSecondary] = useState<
    Record<number, string>
  >(initialRunes?.secondary || {});
  const [selectedExtra, setSelectedExtra] = useState<string | null>(
    initialRunes?.extra || null,
  );

  const secondaryRunes = data[activeSecondaryTreeId];
  const extraTrees = treeIds.filter(id => id !== activeSecondaryTreeId);

  useEffect(() => {
    onUpdate({
      keystone: selectedKeystone,
      secondaryTreeId: activeSecondaryTreeId,
      secondary: selectedSecondary,
      extra: selectedExtra,
    });
  }, [
    selectedKeystone,
    activeSecondaryTreeId,
    selectedSecondary,
    selectedExtra,
    onUpdate,
  ]);

  const getRuneImg = (name: string) => `/images/runes/${name}.WEBP`;

  return (
    <div className={styles.container}>
      {/* 1. KEYSTONES */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Runa Essencial</span>
        <div className={styles.keystoneRow}>
          {data.keystones.map(k => (
            <button
              key={k.name}
              onClick={() => setSelectedKeystone(k.name)}
              className={styles.runeBtn}
            >
              <img
                src={getRuneImg(k.name)}
                alt={k.nome}
                className={`${styles.keystoneImg} ${
                  selectedKeystone === k.name ? styles.selectedKeystone : ''
                }`}
                title={k.nome}
              />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* 2. ÁRVORE SECUNDÁRIA */}
        <div>
          <div className={styles.treeTabs}>
            {treeIds.map(id => (
              <button
                key={id}
                onClick={() => {
                  setActiveSecondaryTreeId(id);
                  setSelectedSecondary({});
                }}
                className={`${styles.treeTabBtn} ${
                  activeSecondaryTreeId === id ? styles.activeTab : ''
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          {[1, 2, 3].map(tier => (
            <div key={tier} className={styles.tierGroup}>
              <div className={styles.runeGrid}>
                {secondaryRunes
                  .filter(r => r.tier === tier)
                  .map(r => (
                    <button
                      key={r.name}
                      onClick={() =>
                        setSelectedSecondary(prev => ({
                          ...prev,
                          [tier]: r.name,
                        }))
                      }
                      className={styles.runeBtn}
                    >
                      <img
                        src={getRuneImg(r.name)}
                        alt={r.nome}
                        className={`${styles.secondaryImg} ${
                          selectedSecondary[tier] === r.name
                            ? styles.selectedSecondary
                            : ''
                        }`}
                        title={r.nome}
                      />
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* 3. EXTRA */}
        <div>
          <span className={styles.sectionTitle}>Runa Extra</span>
          <div className={styles.extraScrollArea}>
            {extraTrees.map(treeId => (
              <div key={treeId} className={styles.extraGrid}>
                {data[treeId].map(s => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedExtra(s.name)}
                    className={styles.runeBtn}
                  >
                    <img
                      src={getRuneImg(s.name)}
                      alt={s.nome}
                      className={`${styles.secondaryImg} ${styles.extraImg} ${
                        selectedExtra === s.name ? styles.selectedExtra : ''
                      }`}
                      title={s.nome}
                    />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
