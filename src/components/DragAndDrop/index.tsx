import { useState } from 'react';
import { Reorder } from 'framer-motion';
import styles from './styles.module.css';

// Estrutura de dados com 7 itens
const initialBoxes = [
  { id: 'box-1', label: '1', href: '#1' },
  { id: 'box-2', label: '2', href: '#2' },
  { id: 'box-3', label: '3', href: '#3' },
  { id: 'box-4', label: '4', href: '#4' },
  { id: 'box-5', label: '5', href: '#5' },
  { id: 'box-6', label: '6', href: '#6' },
  { id: 'box-7', label: '7', href: '#7' },
];

export default function BoxReorderList() {
  const [items, setItems] = useState(initialBoxes);

  return (
    // Reorder.Group define o container horizontal (usando <div> semanticamente)
    <Reorder.Group
      as='div'
      axis='x' // Reordenação horizontal
      values={items}
      onReorder={setItems}
      className={styles['box-list-container']} // Classe para o Flexbox
    >
      {/* Mapeamento para renderizar cada caixa reordenável */}
      {items.map(item => (
        // Reorder.Item é a caixa individual (div de 70x70)
        <Reorder.Item
          key={item.id}
          value={item}
          className={styles['reorder-box']}
          drag
          layout
          dragMomentum={false}
        >
          <span className={styles['box-link']}>{item.label}</span>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
