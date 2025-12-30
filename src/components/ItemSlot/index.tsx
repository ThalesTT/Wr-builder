import styles from './styles.module.css';
import { Frame } from '../Frame';
import { useCallback } from 'react';
import type { ItemSlotProps } from '../../types/Itens';

export function ItemSlot({
  item, // Dados do item (ou null se estiver vazio)
  index, // Posição (0 a 6)
  isActive, // Se este slot é o que receberá o próximo item clicado
  getDisplayName, // Tradutor de nomes
  handleSlotClick, // Define este slot como o ativo
  handleRemoveItem, // Remove o item deste slot
}: ItemSlotProps) {
  // --- Estados do Slot ---
  const isEmpty = item === null;
  const isBootsSlot = index === 5; // Slot reservado para botas
  const isEnchantSlot = index === 6; // Slot reservado para encantamentos

  // --- Identificação Visual ---
  // Define o texto que aparece abaixo do slot quando ele está vazio
  let slotName = 'Slot Vazio';
  if (isBootsSlot) slotName = 'Bota';
  else if (isEnchantSlot) slotName = 'Encantamento';
  else if (index < 5) slotName = `Item ${index + 1}`;

  /**
   * PLACEHOLDER DINÂMICO:
   * Retorna uma imagem de "silhueta" diferente dependendo do tipo de slot,
   * ajudando o usuário a entender o que deve ser colocado ali.
   */
  const getPlaceholderImage = () => {
    if (isBootsSlot) return '/images/itens/no-boots.WEBP';
    if (isEnchantSlot) return '/images/itens/no-ench.WEBP';
    return '/images/itens/no-item.WEBP';
  };

  /**
   * LÓGICA DE CLIQUE:
   * Se o slot estiver vazio, ao clicar nele, o usuário o define como o "foco".
   * O próximo item que ele clicar na lista de itens preencherá este slot.
   */
  const handleItemClick = useCallback(() => {
    if (!item) {
      handleSlotClick(index);
    }
  }, [item, index, handleSlotClick]);

  const handleSelect = useCallback(() => {
    handleSlotClick(index);
  }, [index, handleSlotClick]);

  return (
    <li
      key={index}
      // Aplica a classe 'active-slot' (brilho dourado) se for o slot selecionado
      className={`${styles['slot-container']} ${
        isActive ? styles['active-slot'] : ''
      }`}
      onClick={handleSelect}
    >
      <Frame
        onClick={handleItemClick}
        // O removeClick é passado para o 'X' dentro do Frame
        removeClick={() => handleRemoveItem(index)}
        classStyles='build'
        remove={!isEmpty} // Só mostra o botão de fechar se houver um item para remover
        // Nome: Mostra o nome do item ou o nome do slot (ex: "Bota")
        name={item ? getDisplayName(item).replaceAll('-', ' ') : slotName}
        // Imagem: Mostra o ícone do item ou a silhueta de placeholder
        picture={
          item ? `/images/itens/${item.name}.WEBP` : getPlaceholderImage()
        }
      />
    </li>
  );
}
