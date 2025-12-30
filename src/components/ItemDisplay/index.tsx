// ItemListDisplay.tsx
import { memo } from 'react'; // Importa memo para otimização de performance
import styles from './styles.module.css';
import { Frame } from '../Frame';
import type { ItemData } from '../../types/Itens';

interface ItemDisplayProps {
  finalItens: ItemData[]; // Lista de itens já filtrada (por busca ou categoria)
  getDisplayName: (item: ItemData) => string; // Função para traduzir o nome (PT/EN)
  handleFrameClick: (item: ItemData) => void; // Função para adicionar o item à build
}

/**
 * USO DO memo():
 * O componente é envolvido por memo(). Isso evita que a lista inteira de itens
 * seja renderizada novamente se o componente pai sofrer um re-render que não
 * altere as props deste componente. Essencial em listas longas.
 */
export const ItemDisplay = memo(function ItemDisplay({
  finalItens,
  getDisplayName,
  handleFrameClick,
}: ItemDisplayProps) {
  return (
    <div className={styles['item-container']}>
      <ul className={styles.itens}>
        {finalItens.map(dado => (
          /**
           * USO DA KEY:
           * Aqui utilizamos dado.id como chave única. Isso ajuda o React a
           * rastrear quais itens mudaram, foram adicionados ou removidos
           * de forma muito mais eficiente do que usar o índice do array.
           */
          <li key={dado.id}>
            <Frame
              classStyles={'item'} // Define o layout específico de item no Frame
              remove={false} // Itens do catálogo não possuem botão de remover
              onClick={() => handleFrameClick(dado)} // Ao clicar, envia o item para a build
              picture={`/images/itens/${dado.name}.WEBP`}
              // .replaceAll('-', ' '): Melhora a estética removendo hifens de nomes técnicos
              name={getDisplayName(dado).replaceAll('-', ' ')}
            />
          </li>
        ))}
      </ul>

      {/* FEEDBACK VISUAL: Exibe mensagem amigável caso o filtro/busca não retorne nada */}
      {finalItens.length === 0 && (
        <p className={styles.emptyMessage}>Nenhum item encontrado.</p>
      )}
    </div>
  );
});
