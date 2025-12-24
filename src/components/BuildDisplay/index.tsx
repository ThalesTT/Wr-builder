import styles from './styles.module.css';
import { Frame } from '../Frame';
import { BuildName } from '../BuildName';
import { ItemSlot } from '../ItemSlot';
import type { BuildDisplayProps } from '../../types/Itens';
import { RunesDisplay } from '../RunesDisplay';

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
      <RunesDisplay selectedRunes={selectedRunes} />
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
