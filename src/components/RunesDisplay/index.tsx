import type { SelectedRunes } from '../../types/runes';
import styles from './styles.module.css';

interface RunesDisplayProps {
  selectedRunes: SelectedRunes | null; // Recebe o estado das runas ou null
}

export function RunesDisplay({ selectedRunes }: RunesDisplayProps) {
  /**
   * DEFINIÇÃO DE ESTRUTURA:
   * No Wild Rift, sempre temos 3 runas secundárias da mesma árvore.
   * Criamos este array para garantir que sempre renderizaremos 3 slots visuais,
   * mesmo que estejam vazios.
   */
  const secondarySlots = [0, 1, 2];

  return (
    <div className={styles['runes-display-container']}>
      {/* 1. SLOT DA KEYSTONE (Runa Essencial):
          Aparece em destaque, geralmente maior que as outras. */}
      <div className={`${styles['rune-item']} ${styles['keystone-item']}`}>
        {selectedRunes?.keystone ? (
          <>
            <img
              src={`/images/runes/${selectedRunes.keystone}.WEBP`}
              alt={selectedRunes.keystone}
              className={`${styles['rune-image']} ${styles['keystone-image']}`}
            />
            <span className={styles['rune-label']}>
              {selectedRunes.keystone.replaceAll('-', ' ')}
            </span>
          </>
        ) : (
          /* Placeholder caso não tenha selecionado a Keystone */
          <div className={`${styles.emptyRune} ${styles.emptyKeystone}`} />
        )}
      </div>

      {/* 2. SLOTS DAS SECUNDÁRIAS:
          Iteramos sobre o array fixo para manter o layout estável. */}
      {secondarySlots.map((_, index) => {
        // Extrai os valores do objeto (que está organizado por tier: {1: "nome", 2: "nome"})
        const secondaryArray = selectedRunes?.secondary
          ? Object.values(selectedRunes.secondary)
          : [];
        const rune = secondaryArray[index];

        return (
          <div key={index} className={styles['rune-item']}>
            {rune ? (
              <>
                <img
                  src={`/images/runes/${rune}.WEBP`}
                  alt={rune}
                  className={styles['rune-image']}
                />
                <span className={styles['rune-label']}>
                  {rune.replaceAll('-', ' ')}
                </span>
              </>
            ) : (
              /* Slot vazio para manter o alinhamento do grid */
              <div className={styles.emptyRune} />
            )}
          </div>
        );
      })}

      {/* 3. SLOT DA RUNA EXTRA:
          A quarta runa menor, vinda de uma árvore diferente. */}
      <div className={styles['rune-item']}>
        {selectedRunes?.extra ? (
          <>
            <img
              src={`/images/runes/${selectedRunes.extra}.WEBP`}
              alt={selectedRunes.extra}
              className={`${styles['rune-image']} ${styles['extra-image']}`}
            />
            <span className={styles['rune-label']}>
              {selectedRunes.extra.replaceAll('-', ' ')}
            </span>
          </>
        ) : (
          <div className={`${styles.emptyRune} ${styles.emptyExtra}`} />
        )}
      </div>
    </div>
  );
}
