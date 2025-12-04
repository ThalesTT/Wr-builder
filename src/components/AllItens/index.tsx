import styles from './styles.module.css';
import { Container } from '../Container';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Frame } from '../Frame';
import { NavButtons } from '../NavButtons';
import { MyButton } from '../MyButton';
import { SearchBar } from '../SearchBar';
import { useParams, useSearchParams, type Params } from 'react-router-dom';

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
  id: number;
  type: ITEM_TYPE;
}
//  interface
interface ChampionParam extends Record<string, string | undefined> {
  champion: string;
}

// Interface que define a estrutura do arquivo JSON completo.
interface ItensJson {
  itens: ItemData[];
}

// --- Componente Principal ---
export function AllItens() {
  // Estado que armazena todos os itens carregados do JSON.
  const [itens, setItens] = useState<ItemData[]>([]);
  // Estado que rastreia o filtro de tipo ativo (attack, magic, sup, etc.).
  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  // Estado que armazena o texto digitado na barra de pesquisa.
  const [searchName, setSearchName] = useState<string>('');

  const [selectedItens, setSelectedItens] = useState<ItemData[]>([]);

  const [searchParams] = useSearchParams();
  const [ids, setIds] = useState<number[]>([]);

  const { champion } = useParams<ChampionParam & Params>();
  const championName: string = champion!;

  useEffect(() => {
    const idsString: string | null = searchParams.get('ids');
    if (idsString) {
      // 1. Converte a string de volta para um array de strings
      const stringArray: string[] = idsString.split(',');

      // 2. Transforma o array de strings em um array de números (number[])
      const parsedIds: number[] = stringArray
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));
      //filter() para remover quaisquer valores inválidos que resultem em NaN.
      // Set para garantir IDs únicos e converte de volta para array
      const uniqueIds: number[] = Array.from(new Set(parsedIds));
      setIds(uniqueIds);
    } else {
      setIds([]);
    }
  }, [searchParams]);

  useEffect(() => {
    //será executada sempre que 'itens' (dados carregados) ou 'ids' (da URL) mudar.
    if (ids.length > 0 && itens.length > 0) {
      const urlItens: ItemData[] = [];

      // Itera sobre o array de IDs da URL
      ids.forEach(idDaUrl => {
        // Encontra o item correspondente na lista completa de itens
        const itemFind = itens.find(item => item.id === idDaUrl);

        // Se o item for encontrado (id existe), adicione à lista
        if (itemFind) {
          urlItens.push(itemFind);
        }
      });

      // Atualiza o estado selectedItens com os itens da URL
      setSelectedItens(urlItens);
    } else if (ids.length === 0) {
      // Se a URL não tiver IDs, limpa a lista selecionada.
      setSelectedItens([]);
    }
    // Dependências: 'ids' (muda se a URL muda) e 'itens' (muda quando o JSON é carregado)
  }, [ids, itens]);

  console.log(champion);
  console.log(ids);
  // 1. Lógica de Localização (Idioma do Browser)
  // useMemo calcula o idioma uma única vez ([]), garantindo que o valor é estável.
  const isPortugueseBr = useMemo(() => {
    // Verifica se o idioma do navegador começa com 'pt' (pt-BR, pt-PT, etc.)
    return navigator.language.toLocaleLowerCase().startsWith('pt');
  }, []);

  // 2. Estado para controle de idioma (permite toggle manual).
  // Inicializa com base na detecção do browser (isPortugueseBr).
  const [usePortugueseName, setUsePortugueseName] = useState(isPortugueseBr);

  // 3. Função Auxiliar para Escolher o Nome Correto.
  // useCallback memoizar a função, recriando-a apenas se 'usePortugueseName' mudar.
  const getDisplayName = useCallback(
    (item: ItemData): string => {
      // Se o estado de PT estiver ativo, usa 'item.nome', senão 'item.name'.
      return usePortugueseName ? item.nome : item.name;
    },
    [usePortugueseName],
  );

  const handleFrameClick = useCallback(
    (itemToAdd: ItemData) => {
      // Verifica o limite antes de adicionar
      if (selectedItens.length >= 6) return;
      setSelectedItens(prev => {
        if (prev.find(item => item.name === itemToAdd.name)) {
          return prev;
        }
        return [...prev, itemToAdd];
      });
    },
    [selectedItens],
  );

  // 4. Efeito para Carregar Dados
  // useEffect com array de dependências vazio ([]) garante que o fetch ocorra apenas
  // uma vez após a montagem inicial do componente.
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

  // 5. Filtragem por Tipo (Otimizada)
  // useMemo garante que esta lista filtrada seja recalculada apenas quando
  // a lista de itens base ('itens') ou o filtro de tipo ('itemFilter') mudar.
  const itensRender = useMemo(() => {
    return itens.filter(item => {
      if (itemFilter === 'all') {
        return true; // Se for 'all', inclui todos.
      }
      return item.type === itemFilter; // Filtra pelo tipo selecionado.
    });
  }, [itens, itemFilter]);

  // 6. Filtragem por Nome (Otimizada e Localizada)
  // useMemo garante que esta lista filtrada seja recalculada apenas se
  // a lista de itens, o termo de busca ou o idioma mudar.
  const itensNameRender = useMemo(() => {
    return itens.filter(item => {
      const normalizedSearchTerm = searchName.toLocaleLowerCase().trim();

      // Se a barra de busca estiver vazia, retorna true para todos os itens.
      if (!normalizedSearchTerm) {
        return true;
      }

      // Usa o nome localizado (PT ou EN) para realizar a busca.
      const normalizedItemName = getDisplayName(item).toLocaleLowerCase();

      // Filtra itens cujo nome (localizado) inclui o termo de pesquisa.
      return normalizedItemName.includes(normalizedSearchTerm);
    });
  }, [getDisplayName, itens, searchName]);

  // 7. Lógica de Exibição Final (Prioridade)
  // Decide qual lista de itens renderizar, otimizando o re-render com useMemo.
  const finalItens = useMemo(() => {
    const isSearchActive = searchName.trim().length > 0;

    if (isSearchActive) {
      // Se há texto na busca, prioriza o resultado da pesquisa por nome.
      return itensNameRender;
    }

    // Se a busca está vazia, usa a lista filtrada pelo botão de tipo.
    return itensRender;
  }, [searchName, itensNameRender, itensRender]);

  // 8. Handler da SearchBar
  const handleSearchChange = (newTerm: string) => {
    setSearchName(newTerm);
    //  O filtro de tipo (itemFilter) não é alterado aqui,
    // permitindo que o 'finalItens' combine a lógica de forma fluida.
  };

  // remover um item da lista selecionada (opcional, mas recomendado)
  const handleRemoveItem = useCallback((itemToRemove: ItemData) => {
    setSelectedItens(prev =>
      prev.filter(item => item.name !== itemToRemove.name),
    );
  }, []);

  return (
    <>
      {/* Botões de Filtro por Tipo */}
      <NavButtons>
        <MyButton variety='mage' onClick={() => setItemFilter('magic')} />
        <MyButton variety='adc' onClick={() => setItemFilter('attack')} />
        <MyButton variety='tank' onClick={() => setItemFilter('defense')} />
        <MyButton variety='sup' onClick={() => setItemFilter('sup')} />
        <MyButton variety='all' onClick={() => setItemFilter('all')} />
      </NavButtons>

      {/* Botão de Toggle de Idioma (Debug/Funcionalidade) */}
      <button
        onClick={() => setUsePortugueseName(prev => !prev)}
        style={{ margin: '10px' }}
      >
        Mudar Idioma: {usePortugueseName ? 'Português (ON)' : 'Inglês (OFF)'}
      </button>

      {/* Barra de Pesquisa */}
      <SearchBar
        // Placeholder localizado, dependendo do idioma ativo.
        placeholder={
          usePortugueseName ? 'Pesquise seu item (PT)' : 'Search your item (EN)'
        }
        searchName={searchName}
        onSearchChange={handleSearchChange}
      />

      {/* Conteúdo Principal (Lista de Itens) */}
      <Container>
        <ul className={styles.ul}>
          {/* Mapeia e renderiza a lista final determinada pela lógica de prioridade. */}
          {finalItens.map((dado, index) => (
            <li key={index}>
              <Frame
                remove={false}
                onClick={() => handleFrameClick(dado)}
                // Renderiza o nome correto (PT ou EN) usando a função getDisplayName.
                name={getDisplayName(dado)}
                // O caminho da imagem usa o nome original (dado.name) que deve ser o nome do arquivo.
                picture={`/images/itens/${dado.name}.WEBP`}
              />
            </li>
          ))}
        </ul>
        {/* Mensagem de "Nenhum resultado" se a lista final estiver vazia. */}
        {finalItens.length === 0 && <p>Nenhum item encontrado.</p>}
        <div className={styles['item-list']}>
          <h3>Build</h3>
          <Frame
            name={championName}
            picture={`/images/champs/${champion}.WEBP`}
          />
          {selectedItens.length > 0 && (
            <ul className={styles['item-list']}>
              {selectedItens.map((dado, index) => (
                <Frame
                  remove={true}
                  key={dado.name + index}
                  name={getDisplayName(dado)}
                  picture={`/images/itens/${dado.name}.WEBP`}
                  onClick={() => handleRemoveItem(dado)}
                ></Frame>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </>
  );
}
