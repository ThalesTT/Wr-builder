import styles from './styles.module.css';
import { Frame } from '../Frame';
import { BuildName } from '../BuildName';
import { ItemSlot } from '../ItemSlot';
import type { BuildDisplayProps } from '../../types/Itens';

export function BuildDisplay({
  championName,
  champion,
  buildName,
  setBuildName,
  selectedItens,
  activeSlotIndex,
  getDisplayName,
  handleSlotClick,
  handleRemoveItem,
  selectedRunes,
}: BuildDisplayProps) {
  return (
    <div className={styles['item-build']}>
      <h3>Build</h3>

      {/* Nome da build */}
      <BuildName
        name={buildName}
        placeholder='Nome da build'
        onNameChange={setBuildName}
      />

      {/* Exibindo as runas */}
      {selectedRunes && (
        <div className={styles['runes-container']}>
          <h4>Runas Selecionadas</h4>
          <div className={styles['runes-images']}>
            {/* Exibir a runa Keystone */}
            {selectedRunes.keystone && (
              <div className={styles['rune-img-container']}>
                <img
                  src={`/images/runes/${selectedRunes.keystone}.png`}
                  alt='Keystone'
                  className={styles['rune-img']}
                />
              </div>
            )}

            {/* Exibir as runas secundárias */}
            {selectedRunes.secondary &&
              Object.values(selectedRunes.secondary).map((runeId, index) => (
                <div key={index} className={styles['rune-img-container']}>
                  <img
                    src={`/images/runes/${runeId}.png`}
                    alt={`Secondary Rune ${index + 1}`}
                    className={styles['rune-img']}
                  />
                </div>
              ))}

            {/* Exibir a runa extra */}
            {selectedRunes.extra && (
              <div className={styles['rune-img-container']}>
                <img
                  src={`/images/runes/${selectedRunes.extra}.png`}
                  alt='Extra Rune'
                  className={styles['rune-img']}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de Itens */}
      <ul className={styles['item-list']}>
        <Frame
          name={championName}
          picture={`/images/champs/${champion}.WEBP`}
          classStyles='build'
        />
        {selectedItens.map((dado, index) => (
          <ItemSlot
            key={index}
            item={dado}
            index={index}
            isActive={index === activeSlotIndex}
            getDisplayName={getDisplayName}
            handleSlotClick={handleSlotClick}
            handleRemoveItem={handleRemoveItem}
          />
        ))}
      </ul>
    </div>
  );
}
