// useFetchData.ts
import { useEffect, useState } from 'react';

// Tipagem genérica T (Tipo de dado esperado, ex: ItemData[] ou BootsJson)
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetchData<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true; // Flag para prevenir atualização de estado em componente desmontado

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();

        if (isMounted) {
          setState({ data: json as T, loading: false, error: null });
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : 'Erro desconhecido ao buscar dados.';
        if (isMounted) {
          setState({ data: null, loading: false, error: errorMessage });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup: desativa a flag na desmontagem
    };
  }, [url]);

  return state;
}
