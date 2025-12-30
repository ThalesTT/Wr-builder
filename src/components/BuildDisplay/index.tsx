import styles from './styles.module.css';
import { Frame } from '../Frame';
import { BuildName } from '../BuildName';
import { ItemSlot } from '../ItemSlot';
import type { BuildDisplayProps } from '../../types/Itens';
import { RunesDisplay } from '../RunesDisplay';

export function BuildDisplay({
  championName, // Nome legível do campeão
  champion, // Slug/ID do campeão para buscar a imagem
  buildName, // Estado do nome da build
  setBuildName, // Função para atualizar o nome da build
  selectedItens, // Array com os itens selecionados (ou null)
  activeSlotIndex, // Índice do slot que está em destaque (selecionado)
  getDisplayName, // Função que decide se exibe nome em PT ou EN
  handleSlotClick, // Função para mudar o slot ativo ao clicar
  handleRemoveItem, // Função para limpar um slot de item
  selectedRunes, // Objeto com as runas escolhidas
  save, // Função que dispara o salvamento (LocalStorage)
  share, // Função que gera a URL/Card para compartilhar
}: BuildDisplayProps) {
  return (
    <div className={styles['item-build']}>
      {/* LINHA DO TOPO: Input para o usuário nomear a build */}
      <div className={styles.headerRow}>
        <BuildName
          name={buildName}
          placeholder='Dê um nome a sua build'
          onNameChange={setBuildName}
        />
      </div>

      {/* SEÇÃO DE RUNAS: Exibe visualmente as runas selecionadas */}
      <RunesDisplay selectedRunes={selectedRunes} />

      {/* ÁREA DA BUILD: Campeão + Slots de Itens */}
      <ul className={styles['item-list']}>
        {/* Retrato do Campeão */}
        <Frame
          name={championName}
          picture={`/images/champs/${champion}.WEBP`}
          classStyles='build'
        />

        {/* Mapeamento dos 7 slots de itens (5 comuns + Bota + Encanto) */}
        {selectedItens.map((dado, index) => (
          <ItemSlot
            key={index}
            item={dado} // Dados do item (ou null)
            index={index} // Posição no array
            isActive={index === activeSlotIndex} // Destaque visual se for o slot ativo
            getDisplayName={getDisplayName}
            handleSlotClick={handleSlotClick}
            handleRemoveItem={handleRemoveItem}
          />
        ))}
      </ul>

      {/* BOTÕES DE AÇÃO: Salvar localmente ou Exportar (gerar link/card) */}
      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={save}>
          Salvar Build
        </button>
        <button className={styles.btnPrimary} onClick={share}>
          Exportar Build
        </button>
      </div>
    </div>
  );
}
