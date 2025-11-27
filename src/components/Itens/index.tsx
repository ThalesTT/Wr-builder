import styles from './styles.module.css';
import { Container } from '../Container';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Frame } from '../Frame';
import { NavButtons } from '../NavButtons';
import { MyButton } from '../MyButton';
import { SearchBar } from '../SearchBar';
import { useSearchAndFilter } from '../useSearchAndFilter';

// --- Tipagens (TypeScript Interfaces e Types) ---
// Define os tipos válidos para a propriedade 'type' dos itens.
type ITEM_TYPE = 'attack' | 'magic' | 'defense' | 'sup';
// Define os tipos válidos para o filtro, incluindo 'all' para mostrar todos.
type FilterType = ITEM_TYPE | 'all';

// Interface que define a estrutura de um item carregado do JSON.
interface ItemData {
  name: string; // Nome original (geralmente em inglês)
  nome: string; // Nome em português (para localização)
  price: number;
  type: ITEM_TYPE;
}

// Interface que define a estrutura do arquivo JSON completo.
interface ItensJson {
  itens: ItemData[];
}

export function Itens() {
  const [itens, setItens] = useState<ItemData[]>([]);
  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  const [usePortugueseName, setUsePortugueseName] = useState(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      // Verifica se o idioma do navegador começa com 'pt' (pt-BR, pt-PT, etc.)
      return navigator.language.toLocaleLowerCase().startsWith('pt');
    }
    // Valor padrão se 'navigator' não estiver disponível (ex: SSR)
    return false;
  });

  // 3. Função Auxiliar para Escolher o Nome Correto (Permanece)
  const getDisplayName = useCallback(
    (item: ItemData): string => {
      return usePortugueseName ? item.nome : item.name;
    },
    [usePortugueseName],
  );

  // --- NOVO: Uso do Custom Hook ---
  // Passamos o getDisplayName como getNameFn.
  const {
    searchTerm: searchName,
    handleSearchChange,
    filteredItems: itensByName,
  } = useSearchAndFilter(itens, getDisplayName);
  // --------------------------------

  // (useEffect para carregar dados permanece o mesmo)
  useEffect(() => {
    fetch('/data/itens.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status:${response.status}`);
        }
        return response.json() as Promise<ItensJson>;
      })
      .then(data => setItens(data.itens))
      .catch(error => console.error('Erro ao carregar itens:', error));
  }, []);
  // 5. Filtragem por Tipo (Permanece como itensRender)
  const itensRender = useMemo(() => {
    // ... (lógica de filtro por tipo)
    return itens.filter(item => {
      if (itemFilter === 'all') {
        return true;
      }
      return item.type === itemFilter;
    });
  }, [itens, itemFilter]);

  // 6. Filtragem por Nome (DELETADA! Substituída pelo Custom Hook)
  // Remova o useMemo 'itensNameRender'.

  // 7. Lógica de Exibição Final (Simplificada)
  const finalItens = useMemo(() => {
    const isSearchActive = searchName.trim().length > 0;

    if (isSearchActive) {
      // Usa a lista fornecida pelo Hook
      return itensByName;
    }

    // Se a busca está vazia, usa a lista filtrada pelo botão de tipo.
    return itensRender;
  }, [searchName, itensByName, itensRender]); // Alterei de itensNameRender para itensByName

  // 8. Handler da SearchBar (DELETADO! Substituído pelo handleSearchChange do Hook)
  // Remova a função 'handleSearchChange' local.

  // ... (JSX)

  return (
    <>
      <NavButtons>
        <MyButton variety='mage' onClick={() => setItemFilter('magic')} />
        <MyButton variety='adc' onClick={() => setItemFilter('attack')} />
        <MyButton variety='tank' onClick={() => setItemFilter('defense')} />
        <MyButton variety='sup' onClick={() => setItemFilter('sup')} />
        <MyButton variety='all' onClick={() => setItemFilter('all')} />
      </NavButtons>
      <button
        onClick={() => setUsePortugueseName(prev => !prev)}
        style={{ margin: '10px' }}
      >
        Mudar Idioma: {usePortugueseName ? 'Português (ON)' : 'Inglês (OFF)'}
      </button>
      <SearchBar
        placeholder={
          usePortugueseName ? 'Pesquise seu item (PT)' : 'Search your item (EN)'
        }
        searchName={searchName}
        onSearchChange={handleSearchChange} // Handler do Hook
      />

      {/* ... Conteúdo Principal (Lista de Itens) ... */}
      <Container>
        <ul className={styles.ul}>
          {/* Mapeia e renderiza a lista final determinada pela lógica de prioridade. */}
          {finalItens.map((dado, index) => (
            <li key={index}>
              <Frame
                // Renderiza o nome correto (PT ou EN) usando a função getDisplayName.
                name={getDisplayName(dado)}
                // O caminho da imagem usa o nome original (dado.name) que deve ser o nome do arquivo.
                picture={`/images/itens/${dado.name}.WEBP`}
              />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
