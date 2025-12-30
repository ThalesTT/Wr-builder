import React from 'react';
import { Frame } from '../Frame';
import type { ItemData } from '../../types/Itens';
import type { SelectedRunes } from '../../types/runes';
import styles from './styles.module.css'; // Estilos específicos para o container de preview

interface BuildPreviewProps {
  itemIds: number[]; // Lista de IDs dos itens (geralmente vindo do LocalStorage ou URL)
  itemCatalog: ItemData[]; // O catálogo completo de itens para podermos "traduzir" ID em dados do item
  champion: string; // Nome do campeão para carregar a imagem
  selectedRunes: SelectedRunes; // Embora não esteja sendo usado no JSX atual, está disponível via props
}

export const BuildPreview: React.FC<BuildPreviewProps> = ({
  itemIds,
  itemCatalog,
  champion,
}) => {
  // Verifica se o catálogo de itens já foi carregado para evitar erros de busca
  if (itemCatalog.length === 0) return <div>Carregando itens...</div>;

  /**
   * LÓGICA DE TRADUÇÃO:
   * Como salvamos apenas os IDs para economizar espaço, aqui nós varremos o catálogo
   * para encontrar os dados completos (nome, imagem, etc) de cada item na build.
   */
  const itemsInBuild = itemIds
    .map(id => itemCatalog.find(item => item.id === id))
    // O filtro abaixo remove qualquer item que não foi encontrado no catálogo (proteção contra dados corrompidos)
    .filter((item): item is ItemData => item !== undefined);

  return (
    <div className={styles.previewContainer}>
      {/* Caso a build não tenha itens válidos, mostra um aviso discreto */}
      {itemsInBuild.length === 0 ? (
        <small>Build Vazia ou Itens Desatualizados</small>
      ) : (
        <>
          {/* EXIBIÇÃO DO CAMPEÃO:
              Usa o componente Frame com o estilo 'build' para manter a identidade visual */}
          <Frame
            classStyles='build'
            name={champion}
            picture={`/images/champs/${champion}.WEBP`}
          />

          {/* EXIBIÇÃO DOS ITENS:
              Mapeia os itens encontrados e gera um Frame para cada um deles.
              A chave (key) combina ID e Index para garantir unicidade mesmo se houver itens repetidos. */}
          {itemsInBuild.map((item, index) => (
            <Frame
              key={`${item.id}-${index}`}
              picture={`/images/itens/${item.name}.WEBP`}
              name={item.nome}
              classStyles='build'
            />
          ))}
        </>
      )}
    </div>
  );
};
