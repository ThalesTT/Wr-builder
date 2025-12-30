import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const MAX_BUILD_SIZE = 7; // Limite técnico (5 itens + bota + encanto)

export function useBuildFromUrl() {
  const [searchParams] = useSearchParams();
  const [ids, setIds] = useState<number[]>([]);
  const [buildName, setBuildName] = useState('');

  /**
   * EFEITO 1: Extração de IDs de Itens
   * Monitora a URL em busca do parâmetro '?ids=1,2,3'
   */
  useEffect(() => {
    const idsString = searchParams.get('ids');
    if (idsString) {
      // 1. Converte a string "1,2,3" em um array de números
      // 2. O Set garante que não existam IDs duplicados na build
      // 3. O filter(Boolean) remove possíveis erros de conversão (NaN)
      const uniqueIds = Array.from(
        new Set(
          idsString
            .split(',')
            .map(id => parseInt(id, 10))
            .filter(Boolean),
        ),
      );

      // Aplica o limite máximo para evitar URLs maliciosas ou quebradas
      setIds(uniqueIds.slice(0, MAX_BUILD_SIZE));
    }
  }, [searchParams]);

  /**
   * EFEITO 2: Extração do Nome da Build
   * Monitora a URL em busca do parâmetro '?bd=Nome+da+Build'
   */
  useEffect(() => {
    const bd = searchParams.get('bd');
    if (bd) {
      setBuildName(bd);
    }
  }, [searchParams]);

  // Retorna os dados limpos e prontos para uso pelos componentes
  return { ids, buildName, setBuildName };
}
