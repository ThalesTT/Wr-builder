// useBuildState.ts
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

// --- Tipagens (re-exportadas ou definidas novamente) ---
interface ItemData {
  name: string;
  id: number;
  // ... outras propriedades necessárias para identificação ...
}

export function useBuildState(
  allItens: ItemData[],
  initialSelectedItens: ItemData[] = [],
) {
  const [searchParams] = useSearchParams();
  const [ids, setIds] = useState<number[]>([]);
  const [buildName, setBuildName] = useState<string>('');
  const [selectedItens, setSelectedItens] =
    useState<ItemData[]>(initialSelectedItens);

  // 1. Efeito para extrair IDs e Build Name da URL
  useEffect(() => {
    const idsString: string | null = searchParams.get('ids');
    const bdString: string | null = searchParams.get('bd');

    // Parsing de IDs
    if (idsString) {
      const parsedIds: number[] = idsString
        .split(',')
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));
      setIds(Array.from(new Set(parsedIds)));
    } else {
      setIds([]);
    }

    // Parsing do Build Name
    if (bdString) {
      setBuildName(bdString);
    }
  }, [searchParams]);

  // 2. Efeito para sincronizar a URL (IDs) com os Itens Selecionados
  useEffect(() => {
    // Executa apenas se tivermos IDs da URL e os dados completos (allItens) carregados
    if (ids.length > 0 && allItens.length > 0) {
      const urlItens: ItemData[] = ids
        .map(idDaUrl => allItens.find(item => item.id === idDaUrl))
        .filter((item): item is ItemData => item !== undefined); // Filtra indefinidos

      setSelectedItens(urlItens);
    } else if (ids.length === 0 && allItens.length > 0) {
      // Se não houver IDs na URL, e os itens estiverem carregados, limpa a seleção
      setSelectedItens([]);
    }
    // Dependências: 'ids' (muda se a URL muda) e 'allItens' (muda quando o fetch termina)
  }, [ids, allItens]);

  // 3. Handler para Adicionar Item
  const handleFrameClick = useCallback(
    (itemToAdd: ItemData) => {
      if (selectedItens.length >= 6) return;
      setSelectedItens(prev => {
        if (prev.find(item => item.name === itemToAdd.name)) {
          return prev;
        }
        return [...prev, itemToAdd];
      });
    },
    [selectedItens], // Depende da lista atual para verificar o limite
  );

  // 4. Handler para Remover Item
  const handleRemoveItem = useCallback((itemToRemove: ItemData) => {
    setSelectedItens(prev =>
      prev.filter(item => item.name !== itemToRemove.name),
    );
  }, []);

  return {
    buildName,
    setBuildName,
    selectedItens,
    setSelectedItens,
    handleFrameClick,
    handleRemoveItem,
  };
}
