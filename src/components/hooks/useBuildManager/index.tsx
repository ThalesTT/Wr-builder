import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ItemData } from '../../../types/Itens';

// Configurações de layout do inventário
const MAX_BUILD_SIZE = 7; // 0-4: Itens, 5: Bota, 6: Encanto
const BOOTS_SLOT_INDEX = 5;
const ENCHANT_SLOT_INDEX = 6;

export function useBuildManager(
  ids: number[], // IDs vindos da URL
  catalogMap: Map<number, ItemData>, // Mapa para converter ID em objeto
) {
  // --- Estados Principais ---
  const [selectedItens, setSelectedItens] = useState<(ItemData | null)[]>(
    new Array(MAX_BUILD_SIZE).fill(null),
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  /**
   * EFEITO: Inicialização e Sincronização
   * Sempre que os IDs da URL ou o Catálogo mudarem, ele reconstrói a build.
   */
  useEffect(() => {
    if (ids.length && catalogMap.size) {
      const slots = new Array(MAX_BUILD_SIZE).fill(null);

      ids
        .filter(id => catalogMap.has(id))
        .forEach((id, index) => {
          if (index < MAX_BUILD_SIZE) slots[index] = catalogMap.get(id)!;
        });

      setSelectedItens(slots);

      // Inteligência de Foco: Define o próximo slot vazio para o usuário continuar a build
      const firstEmpty = slots.findIndex(
        (i, idx) => i === null && idx < BOOTS_SLOT_INDEX,
      );
      setActiveSlotIndex(firstEmpty !== -1 ? firstEmpty : BOOTS_SLOT_INDEX);
    } else {
      // Se não houver IDs, limpa a build
      setSelectedItens(new Array(MAX_BUILD_SIZE).fill(null));
      setActiveSlotIndex(0);
    }
  }, [ids, catalogMap]);

  // Memoriza apenas os IDs da build atual (útil para gerar a URL de volta)
  const buildItemIds = useMemo(
    () => selectedItens.filter((i): i is ItemData => i !== null).map(i => i.id),
    [selectedItens],
  );

  /**
   * FUNÇÃO: addItem
   * Contém o "Regulamento" do jogo:
   */
  const addItem = useCallback(
    (item: ItemData) => {
      setSelectedItens(prev => {
        const next = [...prev];

        // 1. Bloqueia itens duplicados pelo nome
        if (prev.some(i => i?.name === item.name)) return prev;

        let index = activeSlotIndex;

        // 2. Regra de Itens de Suporte (limite de 1 no inventário principal)
        if (item.type === 'sup') {
          const supExists = prev.some(
            (i, idx) => i?.type === 'sup' && idx < BOOTS_SLOT_INDEX,
          );
          if (supExists) return prev;
        }

        // 3. Redirecionamento Automático:
        // Se for bota ou encantamento, ignora o slot selecionado e vai para o slot fixo.
        if (item.type === 'boots') index = BOOTS_SLOT_INDEX;
        else if (item.type === 'enchant') index = ENCHANT_SLOT_INDEX;
        // 4. Fallback de Itens Normais:
        // Se o usuário clicar num item comum mas estiver com o slot de bota focado,
        // o código busca o primeiro slot vazio entre 0 e 4.
        else if (index >= BOOTS_SLOT_INDEX) {
          const firstEmpty = prev.findIndex(
            (i, idx) => i === null && idx < BOOTS_SLOT_INDEX,
          );
          if (firstEmpty !== -1) index = firstEmpty;
          else return prev; // Build cheia
        }

        if (index < 0 || index >= MAX_BUILD_SIZE) return prev;

        next[index] = item;

        // 5. Atualiza o foco para o próximo espaço vazio após a inserção
        const nextActive = next.findIndex(
          (i, idx) => i === null && idx < BOOTS_SLOT_INDEX,
        );
        setActiveSlotIndex(nextActive !== -1 ? nextActive : BOOTS_SLOT_INDEX);

        return next;
      });
    },
    [activeSlotIndex],
  );

  /**
   * FUNÇÃO: removeItem
   * Limpa o slot e automaticamente define ele como o slot ativo para preenchimento.
   */
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
