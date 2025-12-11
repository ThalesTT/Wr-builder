// ItemSlot.tsx
import styles from './styles.module.css';
import { Frame } from '../Frame';
import { useCallback } from 'react';
import type { ItemSlotProps } from '../../types/Itens'; // Importe as interfaces necessárias

// Tipos auxiliares para simplificar a passagem de props

export function ItemSlot({
  item,
  index,
  isActive,
  getDisplayName,
  handleSlotClick,
  handleRemoveItem,
}: ItemSlotProps) {
  const isEmpty = item === null;
  const isBootsSlot = index === 5;
  const isEnchantSlot = index === 6;

  let slotName = 'Slot Vazio';
  if (isBootsSlot) slotName = 'Bota';
  else if (isEnchantSlot) slotName = 'Encantamento';
  else if (index < 5) slotName = `Item ${index + 1}`;

  // Se o item estiver presente, o clique deve ser para remover.
  // Se estiver vazio, o clique principal é para selecionar o slot (handleSlotClick).
  const handleItemClick = useCallback(() => {
    if (item) {
      handleRemoveItem(index);
    } else {
      handleSlotClick(index); // Torna o slot ativo
    }
  }, [item, index, handleRemoveItem, handleSlotClick]);

  return (
    <li
      key={index}
      className={`${styles['slot-container']} ${
        isActive ? styles['active-slot'] : ''
      }`}
      onClick={handleItemClick} // O clique no <li> gerencia remover ou ativar
    >
      <Frame
        classStyles='build'
        remove={!isEmpty} // Só permite remover se houver item
        name={item ? getDisplayName(item).replaceAll('-', ' ') : slotName}
        picture={
          item
            ? `/images/itens/${item.name}.WEBP`
            : '/images/itens/terminus.WEBP'
        }
        // O Frame interno não precisa de onClick se o <li> já gerencia.
      />
    </li>
  );
}
