// useBuildManager.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ItemData } from '../../../types/Itens';

const MAX_BUILD_SIZE = 7;
const BOOTS_SLOT_INDEX = 5;
const ENCHANT_SLOT_INDEX = 6;

export function useBuildManager(
  ids: number[],
  catalogMap: Map<number, ItemData>,
) {
  const [selectedItens, setSelectedItens] = useState<(ItemData | null)[]>(
    new Array(MAX_BUILD_SIZE).fill(null),
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  // Inicializa build a partir da URL
  useEffect(() => {
    if (ids.length && catalogMap.size) {
      const slots = new Array(MAX_BUILD_SIZE).fill(null);
      ids
        .filter(id => catalogMap.has(id))
        .forEach((id, index) => {
          if (index < MAX_BUILD_SIZE) slots[index] = catalogMap.get(id)!;
        });
      setSelectedItens(slots);

      // define próximo slot ativo disponível
      const firstEmpty = slots.findIndex(
        (i, idx) => i === null && idx < BOOTS_SLOT_INDEX,
      );
      setActiveSlotIndex(firstEmpty !== -1 ? firstEmpty : BOOTS_SLOT_INDEX);
    } else {
      setSelectedItens(new Array(MAX_BUILD_SIZE).fill(null));
      setActiveSlotIndex(0);
    }
  }, [ids, catalogMap]);

  // ids atuais da build
  const buildItemIds = useMemo(
    () => selectedItens.filter((i): i is ItemData => i !== null).map(i => i.id),
    [selectedItens],
  );

  // Adiciona item respeitando slots e limites
  const addItem = useCallback(
    (item: ItemData) => {
      setSelectedItens(prev => {
        const next = [...prev];

        // evita duplicados
        if (prev.some(i => i?.name === item.name)) return prev;

        let index = activeSlotIndex;

        // iten suporte (uma única vez antes do slot de botas)
        if (item.type === 'sup') {
          const supExists = prev.some(
            (i, idx) => i?.type === 'sup' && idx < BOOTS_SLOT_INDEX,
          );
          if (supExists) return prev;
        }

        // boots e encantamento vão em slots fixos
        if (item.type === 'boots') index = BOOTS_SLOT_INDEX;
        else if (item.type === 'enchant') index = ENCHANT_SLOT_INDEX;
        // itens normais: procura primeiro slot disponível antes de boots
        else if (index >= BOOTS_SLOT_INDEX) {
          const firstEmpty = prev.findIndex(
            (i, idx) => i === null && idx < BOOTS_SLOT_INDEX,
          );
          if (firstEmpty !== -1) index = firstEmpty;
          else return prev; // todos slots normais ocupados
        }

        if (index < 0 || index >= MAX_BUILD_SIZE) return prev;

        next[index] = item;

        // atualiza próximo slot ativo antes de boots
        const nextActive = next.findIndex(
          (i, idx) => i === null && idx < BOOTS_SLOT_INDEX,
        );
        setActiveSlotIndex(nextActive !== -1 ? nextActive : BOOTS_SLOT_INDEX);

        return next;
      });
    },
    [activeSlotIndex],
  );

  // Remove item do slot
  const removeItem = useCallback((index: number) => {
    setSelectedItens(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setActiveSlotIndex(index);
  }, []);

  return {
    selectedItens,
    activeSlotIndex,
    buildItemIds,
    addItem,
    removeItem,
    setActiveSlotIndex,
  };
}
