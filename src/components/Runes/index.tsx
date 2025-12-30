import { useEffect, useMemo, useState } from 'react';
import runesDataImport from '../../data/runes.json';
import styles from './styles.module.css';
import type { RunesJson, SelectedRunes } from '../../types/runes';
import { useSound } from '../hooks/useSound';

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
  const { playSound } = useSound();

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
    <div className={styles['container-runes']}>
      {/* 1. KEYSTONES */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Runa Essencial</span>
        <div className={styles.keystoneRow}>
          {data.keystones.map(k => (
            <button
              key={k.name.replaceAll('-', ' ')}
              data-tooltip={k.name.replaceAll('-', ' ')}
              onClick={() => {
                setSelectedKeystone(k.name);
                playSound('keystone');
              }}
              className={styles.runeBtn}
            >
              <img
                loading='lazy'
                src={getRuneImg(k.name)}
                alt={k.name.replaceAll('-', ' ')}
                className={`${styles.keystoneImg} ${
                  selectedKeystone === k.name ? styles.selectedKeystone : ''
                }`}
                title={k.name.replaceAll('-', ' ')}
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
                data-tooltip={id}
                key={id}
                onClick={() => {
                  setActiveSecondaryTreeId(id);
                  setSelectedSecondary({});
                  playSound('rune');
                }}
                className={`${styles.treeTabBtn} ${
                  activeSecondaryTreeId === id ? styles.activeTab : ''
                }`}
              >
                <img
                  loading='lazy'
                  className={styles['rune-tree']}
                  src={`/images/runes-trees/${id}.WEBP`}
                  alt={id.replaceAll('-', ' ')}
                  title={id.replaceAll('-', ' ')}
                />
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
                      data-tooltip={r.name.replaceAll('-', ' ')}
                      key={r.name}
                      onClick={() => {
                        setSelectedSecondary(prev => ({
                          ...prev,
                          [tier]: r.name,
                        }));
                        playSound('rune');
                      }}
                      className={styles.runeBtn}
                    >
                      <img
                        loading='lazy'
                        src={getRuneImg(r.name)}
                        alt={r.name.replaceAll('-', ' ')}
                        className={`${styles.secondaryImg} ${
                          selectedSecondary[tier] === r.name
                            ? styles.selectedSecondary
                            : ''
                        }`}
                        title={r.name.replaceAll('-', ' ')}
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
              <div
                key={treeId}
                className={`${styles.extraGrid} ${styles.topSection}`}
              >
                {data[treeId].map(s => (
                  <button
                    key={s.name}
                    onClick={() => {
                      setSelectedExtra(s.name);
                      playSound('rune');
                    }}
                    className={styles.runeBtn}
                    data-tooltip={s.name.replaceAll('-', ' ')}
                  >
                    <img
                      loading='lazy'
                      src={getRuneImg(s.name)}
                      alt={s.name.replaceAll('-', ' ')}
                      className={`${styles.secondaryImg} ${styles.extraImg} ${
                        selectedExtra === s.name ? styles.selectedExtra : ''
                      }`}
                      title={s.name.replaceAll('-', ' ')}
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
