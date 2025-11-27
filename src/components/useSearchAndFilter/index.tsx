import { useState, useMemo, useCallback } from 'react';

// Tipagem genérica T para o item do array (ItemData, championsData, etc.).
interface SearchResult<T> {
  searchTerm: string; // O termo de pesquisa atual.
  handleSearchChange: (newTerm: string) => void; // A função para atualizar o termo de pesquisa.
  filteredItems: T[]; // A lista de itens filtrada pelo nome.
}

/**
 * Custom Hook para gerenciar o estado da busca e aplicar a filtragem por nome.
 *
 * @template T - O tipo do item no array (ex: championsData).
 * @param {T[]} items - O array completo de itens a ser filtrado.
 * @param {(item: T) => string} getNameFn - Uma função que recebe um item (T) e retorna a string a ser pesquisada (o nome localizado, por exemplo).
 * @returns {SearchResult<T>} Um objeto contendo o estado, o handler e a lista filtrada.
 */
export function useSearchAndFilter<T>(
  items: T[],
  getNameFn: (item: T) => string,
): SearchResult<T> {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Handler da Busca (memoizado para estabilidade)
  const handleSearchChange = useCallback((newTerm: string) => {
    setSearchTerm(newTerm);
  }, []);

  // 2. Lógica de Filtragem (otimizada)
  const filteredItems = useMemo(() => {
    const normalizedSearchTerm = searchTerm.toLocaleLowerCase().trim();

    // Se a pesquisa estiver vazia, retorna a lista completa.
    if (!normalizedSearchTerm) {
      return items;
    }

    return items.filter(item => {
      // Usa a função getNameFn passada para obter o nome/valor a ser pesquisado.
      const rawName = getNameFn(item);
      const normalizedItemName = rawName.toLocaleLowerCase();

      return normalizedItemName.includes(normalizedSearchTerm);
    });
    // Recalcula se a lista base, o termo de pesquisa ou a função de nome mudar.
  }, [items, searchTerm, getNameFn]);

  return {
    searchTerm,
    handleSearchChange,
    filteredItems,
  };
}
