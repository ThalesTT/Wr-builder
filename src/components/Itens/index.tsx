// AllItens.tsx (Refatorado)
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, type Params } from 'react-router-dom';
import { useFetchData } from '../useFetchData';
import { ItemFilterControls } from '../ItemFilterControls'; // NOVO
import { ItemListDisplay } from '../ItemDisplay'; // NOVO
import { BuildDisplay } from '../BuildDisplay'; // NOVO
import { Container } from '../Container';
import type {
  FilterType,
  ItemData,
  ChampionParam,
  ItensJson,
} from '../../types/Itens';

const MAX_BUILD_SIZE = 7;
const BOOTS_SLOT_INDEX = 5;
const ENCHANT_SLOT_INDEX = 6;
// --------------------------------------------------------

export function Itens() {
  // --- Estados e URL ---
  const [itens, setItens] = useState<ItemData[]>([]);
  const { data: itensJson } = useFetchData<ItensJson>('/data/itens.json');
  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  const [searchName, setSearchName] = useState<string>('');
  const [buildName, setBuildName] = useState<string>('');
  const [selectedItens, setSelectedItens] = useState<(ItemData | null)[]>(
    new Array(MAX_BUILD_SIZE).fill(null),
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const [ids, setIds] = useState<number[]>([]);
  const { champion } = useParams<ChampionParam & Params>();
  const championSlug = champion ?? 'Garen';
  const championName: string = championSlug;

  // --- Lógica de Localização ---
  const isPortugueseBr = useMemo(() => {
    return navigator.language.toLocaleLowerCase().startsWith('pt');
  }, []);
  const [usePortugueseName, setUsePortugueseName] = useState(isPortugueseBr);
  const getDisplayName = useCallback(
    (item: ItemData): string => {
      return usePortugueseName ? item.nome : item.name;
    },
    [usePortugueseName],
  );

  // --- Efeitos de Dados e URL (Mantidos aqui pois são a espinha dorsal) ---
  useEffect(() => {
    const idsString: string | null = searchParams.get('ids');
    if (idsString) {
      const stringArray: string[] = idsString.split(',');
      const parsedIds: number[] = stringArray
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));
      const uniqueIds: number[] = Array.from(new Set(parsedIds));
      setIds(uniqueIds.slice(0, MAX_BUILD_SIZE));
    } else {
      setIds([]);
    }
  }, [searchParams]);

  useEffect(() => {
    const buildName: string | null = searchParams.get('bd');
    if (buildName) {
      setBuildName(buildName);
    }
  }, [searchParams]);

  useEffect(() => {
    if (itensJson) {
      setItens(itensJson.itens);
    }
  }, [itensJson]);

  useEffect(() => {
    if (ids.length > 0 && itens.length > 0) {
      const urlItens: (ItemData | null)[] = new Array(MAX_BUILD_SIZE).fill(
        null,
      );
      ids.forEach((idDaUrl, index) => {
        const itemFind = itens.find(item => item.id === idDaUrl);
        if (itemFind) {
          urlItens[index] = itemFind;
        }
      });
      setSelectedItens(urlItens);
      const firstEmptyIndex = urlItens.findIndex(item => item === null);
      setActiveSlotIndex(
        firstEmptyIndex !== -1 ? firstEmptyIndex : MAX_BUILD_SIZE - 1,
      );
    } else {
      setSelectedItens(new Array(MAX_BUILD_SIZE).fill(null));
      setActiveSlotIndex(0);
    }
  }, [ids, itens]);

  // --- Handlers (Mantidos aqui, pois dependem dos estados principais) ---
  const handleFrameClick = useCallback(
    (itemToAdd: ItemData) => {
      setSelectedItens(prev => {
        const newItems = [...prev];
        let targetIndex = activeSlotIndex;

        const isItemAlreadyPresent = prev.some(
          item => item && item.name === itemToAdd.name,
        );
        if (isItemAlreadyPresent) {
          return prev;
        }

        const isSupportItem = itemToAdd.type === 'sup';
        if (isSupportItem) {
          const isSupPresent = prev.some(
            (item, index) =>
              item && item.type === 'sup' && index < BOOTS_SLOT_INDEX,
          );
          if (isSupPresent) {
            return prev;
          }
        }

        if (itemToAdd.type === 'boots') {
          targetIndex = BOOTS_SLOT_INDEX;
        } else if (itemToAdd.type === 'enchant') {
          targetIndex = ENCHANT_SLOT_INDEX;
        } else if (targetIndex >= BOOTS_SLOT_INDEX) {
          const firstEmptyNormalSlot = prev.findIndex(
            (item, index) => item === null && index < BOOTS_SLOT_INDEX,
          );
          if (firstEmptyNormalSlot !== -1) {
            targetIndex = firstEmptyNormalSlot;
          } else {
            targetIndex = -1;
          }
        }

        if (targetIndex < 0 || targetIndex >= MAX_BUILD_SIZE) return prev;
        newItems[targetIndex] = itemToAdd;

        const nextActiveIndex = newItems.findIndex(
          (item, index) => item === null && index < BOOTS_SLOT_INDEX,
        );
        setActiveSlotIndex(nextActiveIndex !== -1 ? nextActiveIndex : 0);

        return newItems;
      });
    },
    [activeSlotIndex],
  );

  const handleSlotClick = useCallback((index: number) => {
    setActiveSlotIndex(index);
  }, []);

  const handleRemoveItem = useCallback((indexToRemove: number) => {
    setSelectedItens(prev => {
      const newItems = [...prev];
      newItems[indexToRemove] = null;
      return newItems;
    });
    setActiveSlotIndex(indexToRemove);
  }, []);

  const handleSearchChange = (newTerm: string) => {
    setSearchName(newTerm);
  };

  // --- Lógicas de Filtro e Busca (Memoizadas) ---
  const itensRender = useMemo(() => {
    return itens.filter(item => {
      if (itemFilter === 'all') {
        return true;
      }
      return item.type === itemFilter;
    });
  }, [itens, itemFilter]);

  const itensNameRender = useMemo(() => {
    return itens.filter(item => {
      const normalizedSearchTerm = searchName.toLocaleLowerCase().trim();
      if (!normalizedSearchTerm) {
        return true;
      }
      const normalizedItemName = getDisplayName(item).toLocaleLowerCase();
      return normalizedItemName.includes(normalizedSearchTerm);
    });
  }, [getDisplayName, itens, searchName]);

  const finalItens = useMemo(() => {
    const isSearchActive = searchName.trim().length > 0;
    if (isSearchActive) {
      return itensNameRender;
    }
    return itensRender;
  }, [searchName, itensNameRender, itensRender]);

  // --- Renderização Principal (Delegando aos novos componentes) ---
  return (
    <>
      <ItemFilterControls
        setItemFilter={setItemFilter}
        usePortugueseName={usePortugueseName}
        setUsePortugueseName={setUsePortugueseName}
        searchName={searchName}
        handleSearchChange={handleSearchChange}
      />

      <ItemListDisplay
        finalItens={finalItens}
        getDisplayName={getDisplayName}
        handleFrameClick={handleFrameClick}
      />

      <Container>
        <BuildDisplay
          championName={championName}
          champion={championSlug}
          buildName={buildName}
          setBuildName={setBuildName}
          selectedItens={selectedItens}
          activeSlotIndex={activeSlotIndex}
          getDisplayName={getDisplayName}
          handleSlotClick={handleSlotClick}
          handleRemoveItem={handleRemoveItem}
        />
      </Container>
    </>
  );
}
