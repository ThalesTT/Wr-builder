// useLocalization.ts
import { useCallback, useMemo, useState } from 'react';

// Tipagem básica para dados que têm nomes em inglês e português
interface LocalizedData {
  name: string;
  nome: string;
}

export function useLocalization() {
  // 1. Detecção inicial do idioma do navegador (só executa uma vez)
  const isPortugueseBr = useMemo(() => {
    return navigator.language.toLocaleLowerCase().startsWith('pt');
  }, []);

  // 2. Estado para controle de idioma (permite toggle manual)
  const [usePortugueseName, setUsePortugueseName] = useState(isPortugueseBr);

  // 3. Função auxiliar para retornar o nome correto (memoizada)
  const getDisplayName = useCallback(
    (item: LocalizedData): string => {
      return usePortugueseName ? item.nome : item.name;
    },
    [usePortugueseName],
  );

  return {
    usePortugueseName,
    setUsePortugueseName,
    getDisplayName,
  };
}
