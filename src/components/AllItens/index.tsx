import styles from './styles.module.css';
import { Container } from '../Container';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Frame } from '../Frame';
import { NavButtons } from '../NavButtons';
import { MyButton } from '../MyButton';
import { SearchBar } from '../SearchBar';
import { useParams, useSearchParams, type Params } from 'react-router-dom';
import { BuildName } from '../BuildName';
import { useFetchData } from '../useFetchData';

// --- Tipagens (TypeScript Interfaces e Types) ---
// Define os tipos válidos para a propriedade 'type' dos itens.
type ITEM_TYPE = 'attack' | 'magic' | 'defense' | 'sup' | 'boots' | 'enchant';
// Define os tipos válidos para o filtro, incluindo 'all' para mostrar todos.
type FilterType = ITEM_TYPE | 'all';

// type NORMAL_ITEM_TYPE = 'attack' | 'magic' | 'defense';

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
// const NORMAL_TYPES: ITEM_TYPE[] = ['attack', 'magic', 'defense', 'sup'];
// const UNIQUE_TYPES: ITEM_TYPE[] = ['boots', 'enchant', 'sup'];
const MAX_BUILD_SIZE = 7;
const BOOTS_SLOT_INDEX = 5;
const ENCHANT_SLOT_INDEX = 6;

// function isTypePresent(
//   selectedItems: (ItemData | null)[],
//   itemType: ITEM_TYPE,
// ) {
//   if (!UNIQUE_TYPES.includes(itemType)) return false;
//   return selectedItems.some(item => item && item.type === itemType);
// }

// --- Componente Principal ---
export function AllItens() {
  // Estado que armazena todos os itens carregados do JSON.
  const [itens, setItens] = useState<ItemData[]>([]);

  const { data: itensJson } = useFetchData<ItensJson>('/data/itens.json');

  // Estado que rastreia o filtro de tipo ativo (attack, magic, sup, etc.).
  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  // Estado que armazena o texto digitado na barra de pesquisa.
  const [searchName, setSearchName] = useState<string>('');

  const [buildName, setBuildName] = useState<string>('');

  const [selectedItens, setSelectedItens] = useState<(ItemData | null)[]>(
    new Array(MAX_BUILD_SIZE).fill(null),
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const [ids, setIds] = useState<number[]>([]);

  const { champion } = useParams<ChampionParam & Params>();
  const championName: string = champion!;

  // Verifica se o tipo que está sendo testado é um dos tipos que deve ser único.

  // useEffect(() => {
  //   const idsString: string | null = searchParams.get('ids');
  //   if (idsString) {
  //     // 1. Converte a string de volta para um array de strings
  //     const stringArray: string[] = idsString.split(',');

  //     // 2. Transforma o array de strings em um array de números (number[])
  //     const parsedIds: number[] = stringArray
  //       .map(id => parseInt(id, 10))
  //       .filter(id => !isNaN(id));
  //     //filter() para remover quaisquer valores inválidos que resultem em NaN.
  //     // Set para garantir IDs únicos e converte de volta para array
  //     const uniqueIds: number[] = Array.from(new Set(parsedIds));
  //     if (uniqueIds.length > 7) {
  //       // Se houver mais de 6 IDs, trate como se não houvesse nenhum.
  //       setIds([]);
  //     } else {
  //       // Se for 0 a 6 IDs, armazene-os.
  //       setIds(uniqueIds);
  //     }
  //   } else {
  //     setIds([]);
  //   }
  // }, [searchParams]);

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
      setIds(uniqueIds.slice(0, MAX_BUILD_SIZE));
    } else {
      setIds([]);
      // Se for 0 a 6 IDs, armazene-os.
    }
  }, [searchParams]);

  useEffect(() => {
    const buildName: string | null = searchParams.get('bd');
    console.log('aqruiii', buildName);
    if (buildName) {
      setBuildName(buildName);
    }
  }, [searchParams]);

  useEffect(() => {
    if (ids.length > 0 && itens.length > 0) {
      // MODIFICAÇÃO 2.1: Inicializa um array de 7 slots com null
      const urlItens: (ItemData | null)[] = new Array(MAX_BUILD_SIZE).fill(
        null,
      );

      ids.forEach((idDaUrl, index) => {
        const itemFind = itens.find(item => item.id === idDaUrl);
        if (itemFind) {
          urlItens[index] = itemFind; // Coloca o item no slot
        }
      });

      setSelectedItens(urlItens); // MODIFICAÇÃO 2.2: Define o próximo slot ativo (primeiro vazio ou o último se tudo estiver cheio)

      const firstEmptyIndex = urlItens.findIndex(item => item === null);
      setActiveSlotIndex(
        firstEmptyIndex !== -1 ? firstEmptyIndex : MAX_BUILD_SIZE - 1,
      );
    } else {
      // Se não houver IDs, reseta e ativa o slot 0
      setSelectedItens(new Array(MAX_BUILD_SIZE).fill(null));
      setActiveSlotIndex(0);
    } // Dependências: 'ids' (muda se a URL muda) e 'itens' (muda quando o JSON é carregado)
  }, [ids, itens]);

  // useEffect(() => {
  //   //será executada sempre que 'itens' (dados carregados) ou 'ids' (da URL) mudar.
  //   if (ids.length > 0 && itens.length > 0) {
  //     const urlItens: ItemData[] = [];

  //     // Itera sobre o array de IDs da URL
  //     ids.forEach(idDaUrl => {
  //       // Encontra o item correspondente na lista completa de itens
  //       const itemFind = itens.find(item => item.id === idDaUrl);

  //       // Se o item for encontrado (id existe), adicione à lista
  //       if (itemFind) {
  //         urlItens.push(itemFind);
  //       }
  //     });

  //     // Atualiza o estado selectedItens com os itens da URL
  //     setSelectedItens(urlItens);
  //   } else {
  //     // Se a URL não tiver IDs, limpa a lista selecionada.
  //     setSelectedItens([]);
  //   }
  //   // Dependências: 'ids' (muda se a URL muda) e 'itens' (muda quando o JSON é carregado)
  // }, [ids, itens]);

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
  ); // FUNÇÃO 3.1: Adicionar ou Substituir Item no Slot Ativo

  // const handleFrameClick = useCallback(
  //   (itemToAdd: ItemData) => {
  //     // Verifica o limite antes de adicionar
  //     if (selectedItens.length >= 7) return;
  //     setSelectedItens(prev => {
  //       if (prev.find(item => item.name === itemToAdd.name)) {
  //         return prev;
  //       }
  //       if (isTypePresent(prev, itemToAdd.type)) return prev;
  //       const isItemNormal = NORMAL_TYPES.includes(itemToAdd.type);
  //       // Conta quantos itens normais já estão na lista
  //       if (isItemNormal) {
  //         const normalItemCount = prev.filter(item =>
  //           NORMAL_TYPES.includes(item.type),
  //         ).length;

  //         if (normalItemCount >= 5) {
  //           return prev;
  //         }
  //       }
  //       return [...prev, itemToAdd];
  //     });
  //   },
  //   [selectedItens.length],
  // );

  // ... (getDisplayName)

  const handleFrameClick = useCallback(
    (itemToAdd: ItemData) => {
      setSelectedItens(prev => {
        const newItems = [...prev];
        let targetIndex = activeSlotIndex;

        // NOVO PONTO 1: VERIFICAÇÃO DE DUPLICAÇÃO GERAL
        // Verifica se o itemToAdd já está presente em QUALQUER lugar do array (prev)
        const isItemAlreadyPresent = prev.some(
          item => item && item.name === itemToAdd.name,
        );
        if (isItemAlreadyPresent) {
          return prev; // Impede a duplicação
        }

        // NOVO PONTO 2: VERIFICAÇÃO DE UNICIDADE DO TIPO 'SUP'
        const isSupportItem = itemToAdd.type === 'sup';
        if (isSupportItem) {
          const isSupPresent = prev.some(
            (item, index) =>
              item && item.type === 'sup' && index < BOOTS_SLOT_INDEX,
          );

          // Se já houver um item 'sup' nos slots normais (0-4), impede a adição.
          if (isSupPresent) {
            return prev;
          }
        }

        // Lógica de Slots Fixos (BOOTS e ENCHANT)
        if (itemToAdd.type === 'boots') {
          targetIndex = BOOTS_SLOT_INDEX;
        } else if (itemToAdd.type === 'enchant') {
          targetIndex = ENCHANT_SLOT_INDEX;
        } else if (targetIndex >= BOOTS_SLOT_INDEX) {
          // Se item normal (ou sup) for clicado, mas o slot ativo for fixo (5 ou 6),
          // busca o primeiro slot normal vazio (0-4).
          const firstEmptyNormalSlot = prev.findIndex(
            (item, index) => item === null && index < BOOTS_SLOT_INDEX,
          );
          if (firstEmptyNormalSlot !== -1) {
            targetIndex = firstEmptyNormalSlot;
          } else {
            // Se todos os slots normais (0-4) estiverem cheios, usa o slot ativo (pode ser 5 ou 6, substituindo).
            targetIndex = -1;
          }
        }

        // Se o slot alvo já tiver um item, e esse item não for o mesmo (já verificado), ele será substituído.
        // Se for um slot normal (0-4) e estiver cheio, o targetIndex cairá aqui e substituirá o item.
        // Se for um slot fixo (5 ou 6) e estiver cheio, ele substituirá (o que é o esperado para boots/enchant).

        if (targetIndex < 0 || targetIndex >= MAX_BUILD_SIZE) return prev;

        // Substitui o item no slot de destino
        newItems[targetIndex] = itemToAdd;

        // Define o próximo slot ativo: primeiro slot normal vazio (0-4), ou 0 se todos cheios.
        const nextActiveIndex = newItems.findIndex(
          (item, index) => item === null && index < BOOTS_SLOT_INDEX,
        );

        setActiveSlotIndex(nextActiveIndex !== -1 ? nextActiveIndex : 0);

        return newItems;
      });
    },
    [activeSlotIndex],
  );
  // FUNÇÃO 3.2: Selecionar um slot da build para se tornar o ativo
  const handleSlotClick = useCallback((index: number) => {
    setActiveSlotIndex(index);
  }, []);

  // FUNÇÃO 3.3: Remover item de um slot específico
  const handleRemoveItem = useCallback((indexToRemove: number) => {
    setSelectedItens(prev => {
      const newItems = [...prev];
      newItems[indexToRemove] = null; // Apenas define o slot como vazio
      return newItems;
    }); // Após remover, define o slot removido como o novo slot ativo.
    setActiveSlotIndex(indexToRemove);
  }, []); // ... (efeitos para carregar dados, itensRender, itensNameRender, finalItens)

  // 4. Efeito para Carregar Dados
  // useEffect com array de dependências vazio ([]) garante que o fetch ocorra apenas
  // uma vez após a montagem inicial do componente.

  useEffect(() => {
    if (itensJson) {
      setItens(itensJson.itens);
    }
  }, [itensJson]);

  // useEffect(() => {
  //   fetch('/data/itens.json')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status:${response.status}`);
  //       }
  //       return response.json() as Promise<ItensJson>;
  //     })
  //     .then(data => setItens(data.itens))
  //     .catch(error => console.error('Erro ao carregar itens:', error));
  // }, []);

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
  // const handleRemoveItem = useCallback((itemToRemove: ItemData) => {
  //   setSelectedItens(prev =>
  //     prev.filter(item => item.name !== itemToRemove.name),
  //   );
  // }, []);

  //   return (
  //     <>
  //       {/* Botões de Filtro por Tipo */}
  //       <NavButtons>
  //         <MyButton variety='mage' onClick={() => setItemFilter('magic')} />
  //         <MyButton variety='adc' onClick={() => setItemFilter('attack')} />
  //         <MyButton variety='tank' onClick={() => setItemFilter('defense')} />
  //         <MyButton variety='sup' onClick={() => setItemFilter('sup')} />
  //         <MyButton variety='all' onClick={() => setItemFilter('all')} />
  //         <MyButton variety='all' onClick={() => setItemFilter('boots')} />
  //         <MyButton variety='all' onClick={() => setItemFilter('enchant')} />
  //       </NavButtons>

  //       {/* Botão de Toggle de Idioma (Debug/Funcionalidade) */}
  //       <button
  //         onClick={() => setUsePortugueseName(prev => !prev)}
  //         style={{ margin: '10px' }}
  //       >
  //         Mudar Idioma: {usePortugueseName ? 'Português (ON)' : 'Inglês (OFF)'}
  //       </button>

  //       {/* Barra de Pesquisa */}
  //       <SearchBar
  //         // Placeholder localizado, dependendo do idioma ativo.
  //         placeholder={
  //           usePortugueseName ? 'Pesquise seu item (PT)' : 'Search your item (EN)'
  //         }
  //         searchName={searchName}
  //         onSearchChange={handleSearchChange}
  //       />

  //       {/* Conteúdo Principal (Lista de Itens) */}
  //       <Container>
  //         <ul className={styles.itens}>
  //           {/* Mapeia e renderiza a lista final determinada pela lógica de prioridade. */}
  //           {finalItens.map((dado, index) => (
  //             <li key={index}>
  //               <Frame
  //                 classStyles={'item'}
  //                 remove={false}
  //                 onClick={() => handleFrameClick(dado)}
  //                 // Renderiza o nome correto (PT ou EN) usando a função getDisplayName.
  //                 name={getDisplayName(dado)}
  //                 // O caminho da imagem usa o nome original (dado.name) que deve ser o nome do arquivo.
  //                 picture={`/images/itens/${dado.name}.WEBP`}
  //               />
  //             </li>
  //           ))}
  //         </ul>
  //         {/* Mensagem de "Nenhum resultado" se a lista final estiver vazia. */}
  //         {finalItens.length === 0 && <p>Nenhum item encontrado.</p>}
  //         <div className={styles['item-list']}>
  //           <h3>Build</h3>
  //           <BuildName
  //             name={buildName}
  //             placeholder='Nome da build'
  //             onNameChange={setBuildName}
  //           />
  //           <Frame
  //             name={championName}
  //             picture={`/images/champs/${champion}.WEBP`}
  //             classStyles='champion'
  //           />
  //           {selectedItens.length > 0 && (
  //             <ul className={styles['item-list']}>
  //               {selectedItens.map((dado, index) => (
  //                 <Frame
  //                   classStyles='item'
  //                   remove={true}
  //                   key={dado.name + index}
  //                   name={getDisplayName(dado)}
  //                   picture={`/images/itens/${dado.name}.WEBP`}
  //                   onClick={() => handleRemoveItem(dado)}
  //                 ></Frame>
  //               ))}
  //             </ul>
  //           )}
  //         </div>
  //       </Container>
  //     </>
  //   );
  // }

  return (
    <>
      <NavButtons>
        <MyButton variety='mage' onClick={() => setItemFilter('magic')} />
        <MyButton variety='adc' onClick={() => setItemFilter('attack')} />
        <MyButton variety='tank' onClick={() => setItemFilter('defense')} />
        <MyButton variety='sup' onClick={() => setItemFilter('sup')} />
        <MyButton variety='all' onClick={() => setItemFilter('all')} />
        <MyButton variety='all' onClick={() => setItemFilter('boots')} />
        <MyButton variety='all' onClick={() => setItemFilter('enchant')} />
      </NavButtons>
      <button
        onClick={() => setUsePortugueseName(prev => !prev)}
        style={{ margin: '10px' }}
      >
        Mudar Idioma: {usePortugueseName ? 'Português (ON)' : 'Inglês (OFF)'}
      </button>
      <SearchBar
        // Placeholder localizado, dependendo do idioma ativo.
        placeholder={
          usePortugueseName ? 'Pesquise seu item (PT)' : 'Search your item (EN)'
        }
        searchName={searchName}
        onSearchChange={handleSearchChange}
      />
      <Container>
        <ul className={styles.itens}>
          {/* Mapeia e renderiza a lista final determinada pela lógica de prioridade. */}
          {finalItens.map((dado, index) => (
            <li key={index}>
              <Frame
                classStyles={'item'}
                remove={false}
                onClick={() => handleFrameClick(dado)}
                // Renderiza o nome correto (PT ou EN) usando a função getDisplayName.
                // O caminho da imagem usa o nome original (dado.name) que deve ser o nome do arquivo.
                picture={`/images/itens/${dado.name}.WEBP`}
                name={getDisplayName(dado).replaceAll('-', ' ')}
              />
            </li>
          ))}
        </ul>
        {/* Mensagem de "Nenhum resultado" se a lista final estiver vazia. */}
        {finalItens.length === 0 && <p>Nenhum item encontrado.</p>}
        <div className={styles['item-list']}>
          <h3>Build</h3>
          <BuildName
            name={buildName}
            placeholder='Nome da build'
            onNameChange={setBuildName}
          />
          <Frame
            name={championName}
            picture={`/images/champs/${champion}.WEBP`}
            classStyles='champion'
          />
          <ul className={styles['item-list']}>
            {selectedItens.map((dado, index) => {
              const isActive = index === activeSlotIndex;
              const isEmpty = dado === null;
              const isBootsSlot = index === BOOTS_SLOT_INDEX;
              const isEnchantSlot = index === ENCHANT_SLOT_INDEX;
              let slotName = 'Slot Vazio';
              if (isBootsSlot) slotName = 'Bota';
              else if (isEnchantSlot) slotName = 'Encantamento';
              else if (index < BOOTS_SLOT_INDEX) slotName = `Item ${index + 1}`;

              return (
                <li
                  key={index} // Classe para destacar o slot ativo (requer CSS)
                  className={`${styles['slot-container']} ${
                    isActive ? styles['active-slot'] : ''
                  }`}
                  onClick={() => handleSlotClick(index)} // Torna o slot ativo
                >
                  <Frame
                    classStyles='item'
                    remove={!isEmpty} // Só permite remover se houver item
                    key={index} // Verificação de nulo: usa 'dado' ou o placeholder
                    name={
                      dado ? getDisplayName(dado).replace('-', ' ') : slotName
                    }
                    picture={
                      dado
                        ? `/images/itens/${dado.name}.WEBP`
                        : '/images/placeholder.WEBP'
                    }
                    onClick={dado ? () => handleRemoveItem(index) : undefined}
                  ></Frame>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </>
  );
}
