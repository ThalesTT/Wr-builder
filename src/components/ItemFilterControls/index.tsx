import { NavButtons } from '../NavButtons';
import { MyButton, type variety } from '../MyButton';
import type { FilterType } from '../../types/Itens';
import { BuildName } from '../BuildName';
import { Header } from '../Header';

interface ItemFilterControlsProps {
  itemFilter: FilterType; // Categoria de item selecionada no momento
  setItemFilter: (filter: FilterType) => void;
  usePortugueseName: boolean; // Idioma atual (PT ou EN)
  setUsePortugueseName: React.Dispatch<React.SetStateAction<boolean>>;
  searchName: string; // Termo digitado na busca
  showRunes: boolean; // Controla se a tela exibe Runas ou Itens
  handleSearchChange: (newTerm: string) => void;
  handleChangeRune: (value?: boolean) => void;
}

export function ItemFilterControls({
  itemFilter,
  setItemFilter,
  searchName,
  showRunes,
  handleSearchChange,
  handleChangeRune,
}: ItemFilterControlsProps) {
  /**
   * MAPEAMENTO DE OPÇÕES:
   * Criamos um array de objetos para gerar os botões automaticamente.
   * Isso facilita a manutenção: se um novo tipo de item for lançado no Wild Rift,
   * basta adicionar uma linha aqui.
   */
  const filterOptions: { id: FilterType; label: variety }[] = [
    { id: 'magic', label: 'magic' },
    { id: 'attack', label: 'attack' },
    { id: 'defense', label: 'defense' },
    { id: 'sup', label: 'suporte' },
    { id: 'all', label: 'all' },
    { id: 'boots', label: 'boots' },
    { id: 'enchant', label: 'enchant' },
  ];

  return (
    <>
      {/* Componente de Logotipo/Topo */}
      <Header />

      {/* NAVEGAÇÃO POR CATEGORIAS */}
      <NavButtons>
        {filterOptions.map(opt => (
          <MyButton
            key={opt.id}
            variety={opt.label}
            // Um botão só fica ativo se a categoria for a dele E as runas estiverem fechadas
            isActive={itemFilter === opt.id && !showRunes}
            onClick={() => {
              setItemFilter(opt.id); // Muda a categoria de itens
              handleChangeRune(false); // Garante que as runas fechem ao trocar de categoria
            }}
          />
        ))}

        {/* BOTÃO ESPECIAL DE RUNAS:
            Lógica separada porque ele alterna entre duas interfaces diferentes (Itens vs Runas). */}
        <MyButton
          variety={showRunes ? 'all' : 'rune'} // Muda o ícone se estiver aberto ou fechado
          isActive={showRunes}
          onClick={() => handleChangeRune()} // Inverte o estado de exibição das runas
        />
      </NavButtons>

      {/* BUSCA POR TEXTO:
          A barra de busca só aparece se o usuário estiver vendo os Itens.
          Se estiver na aba de Runas, a busca é escondida para limpar a interface. */}
      {!showRunes && (
        <BuildName
          name={searchName}
          onNameChange={handleSearchChange}
          placeholder='Pesquise seu item (PT)'
        />
      )}
    </>
  );
}
