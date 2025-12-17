import { useEffect, useMemo, useState } from 'react';
import type { ItemData, ItensJson } from '../../../types/Itens';
import { useFetchData } from '../useFetchData';

export function useItemCatalog() {
  const { data } = useFetchData<ItensJson>('/data/itens.json');
  const [items, setItems] = useState<ItemData[]>([]);

  useEffect(() => {
    if (data) setItems(data.itens);
  }, [data]);

  const catalogMap = useMemo(
    () => new Map(items.map(item => [item.id, item])),
    [items],
  );

  return { items, catalogMap };
}
