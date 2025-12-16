// ItemListDisplay.tsx
import styles from './styles.module.css';
import { Container } from '../Container';
import { Frame } from '../Frame';
import type { ItemData } from '../../types/Itens';

interface ItemDisplayProps {
  finalItens: ItemData[];
  getDisplayName: (item: ItemData) => string;
  handleFrameClick: (item: ItemData) => void;
}

export function ItemDisplay({
  finalItens,
  getDisplayName,
  handleFrameClick,
}: ItemDisplayProps) {
  return (
    <Container>
      <ul className={styles.itens}>
        {finalItens.map((dado, index) => (
          <li key={index}>
            <Frame
              classStyles={'item'}
              remove={false}
              onClick={() => handleFrameClick(dado)}
              picture={`/images/itens/${dado.name}.WEBP`}
              name={getDisplayName(dado).replaceAll('-', ' ')}
            />
          </li>
        ))}
      </ul>
      {finalItens.length === 0 && <p>Nenhum item encontrado.</p>}
    </Container>
  );
}
