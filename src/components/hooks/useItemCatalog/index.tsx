import { useEffect, useMemo, useState } from 'react';
import { useFetchData } from '../useFetchData';
import type { ItemData } from '../../../types/Itens';

export function useItemCatalog() {
  const { data } = useFetchData('itens');
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
