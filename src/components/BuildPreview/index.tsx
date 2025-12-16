// BuildPreview.tsx (Crie este novo arquivo)

import React from 'react';
import { Frame } from '../Frame';
import type { ItemData } from '../../types/Itens';

interface BuildPreviewProps {
  itemIds: number[];
  itemCatalog: ItemData[];
}

export const BuildPreview: React.FC<BuildPreviewProps> = ({
  itemIds,
  itemCatalog,
}) => {
  if (itemCatalog.length === 0) return <div>Carregando itens...</div>;

  // Mapeia os IDs para os objetos de item
  const itemsInBuild = itemIds
    .map(id => itemCatalog.find(item => item.id === id))
    .filter((item): item is ItemData => item !== undefined); // Filtra nulos/undefined

  return (
    <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
      {itemsInBuild.length === 0 ? (
        <small>Build Vazia ou Itens Desatualizados</small>
      ) : (
        itemsInBuild.map((item, index) => (
          // Use seu componente Frame para renderizar
          <Frame
            key={index}
            picture={`/images/itens/${item.name}.WEBP`} // Ajuste o path da imagem
            name={item.name}
            classStyles='item-preview' // Estilize isso no seu CSS
          />
        ))
      )}
    </div>
  );
};
