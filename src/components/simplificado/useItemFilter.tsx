// useItemFiltering.ts
import { useMemo, useState, useEffect } from 'react';
import { useFetchData } from '../useFetchData'; // Assumindo que useFetchData está no mesmo nível

// --- Tipagens ---
type ITEM_TYPE = 'attack' | 'magic' | 'defense' | 'sup';
type FilterType = ITEM_TYPE | 'all';

interface ItemData {
  name: string;
  nome: string;
  price: number;
  id: number;
  type: ITEM_TYPE;
}

interface ItensJson {
  itens: ItemData[];
}

interface LocalizationHook {
  getDisplayName: (item: ItemData) => string;
}

// O hook recebe a função de localização como dependência
export function useItemFiltering(localization: LocalizationHook) {
  // 1. Busca de Dados (usando seu Custom Hook de Fetch)
  const {
    data: itensJson,
    loading,
    error,
  } = useFetchData<ItensJson>('/data/itens.json');

  // 2. Estado para todos os itens (extraído do JSON)
  const [itens, setItens] = useState<ItemData[]>([]);

  // 3. Estados de Filtro e Busca
  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  const [searchName, setSearchName] = useState<string>('');

  // Efeito para extrair os itens do JSON após o carregamento
  useEffect(() => {
    if (itensJson) {
      setItens(itensJson.itens);
    }
  }, [itensJson]);

  // 4. Filtragem por Tipo (usa o 'itemFilter')
  const itensRender = useMemo(() => {
    return itens.filter(item => {
      if (itemFilter === 'all') return true;
      return item.type === itemFilter;
    });
  }, [itens, itemFilter]);

  // 5. Filtragem por Nome (usa o 'searchName' e a função de localização)
  const itensNameRender = useMemo(() => {
    return itens.filter(item => {
      const normalizedSearchTerm = searchName.toLocaleLowerCase().trim();
      if (!normalizedSearchTerm) return true;

      const normalizedItemName = localization
        .getDisplayName(item)
        .toLocaleLowerCase();

      return normalizedItemName.includes(normalizedSearchTerm);
    });
  }, [localization, itens, searchName]);

  // 6. Lista de Exibição Final (Prioriza Busca > Filtro)
  const finalItens = useMemo(() => {
    const isSearchActive = searchName.trim().length > 0;
    return isSearchActive ? itensNameRender : itensRender;
  }, [searchName, itensNameRender, itensRender]);

  return {
    itens, // Lista completa (necessária para useBuildState)
    finalItens, // Lista para renderização
    loading,
    error,
    itemFilter,
    setItemFilter,
    searchName,
    setSearchName,
  };
}
