import { useMemo } from 'react';

// Imports dos JSONs diretos do SRC
import itensData from '../../../data/itens.json';
import runesData from '../../../data/runes.json';
import champsData from '../../../data/champions.json';

// Tipagens
import type { ItemData } from '../../../types/Itens';
import type { RunesJson } from '../../../types/runes';

/** * Interface para os Campeões (ajustada para refletir a estrutura do JSON)
 */
export interface Champ {
  name: string;
  lanes: string[];
}

/** * MAPEAMENTO DE DADOS:
 * Este objeto define exatamente o que cada "chave" (string) deve retornar.
 * Isso elimina a necessidade de 'any' e permite que o editor sugira os campos
 * corretos ao usar o hook.
 */
interface DataMap {
  itens: { itens: ItemData[] }; // O JSON de itens tem uma propriedade "itens" que é um array
  runes: RunesJson; // O JSON de runas já é o objeto direto
  champs: { champ: Champ[] }; // O JSON de champions tem uma propriedade "champ" que é um array
}

/**
 * HOOK useFetchData:
 * @template K - Uma chave que deve existir obrigatoriamente em DataMap ('itens' | 'runes' | 'champs')
 * @param key - A chave do dado que você deseja buscar
 */
export function useFetchData<K extends keyof DataMap>(key: K) {
  return useMemo(() => {
    /**
     * LÓGICA DE SELEÇÃO:
     * Inicializamos como null mas tipamos como a união de todos os valores possíveis
     * de DataMap ou null.
     */
    let selectedData: DataMap[keyof DataMap] | null = null;

    if (key === 'itens') {
      selectedData = itensData as DataMap['itens'];
    } else if (key === 'runes') {
      selectedData = runesData as DataMap['runes'];
    } else if (key === 'champs') {
      selectedData = champsData as DataMap['champs'];
    }

    return {
      /**
       * 'as DataMap[K]' garante que, se você pedir 'itens',
       * o TypeScript saberá que 'data' contém { itens: ItemData[] }.
       */
      data: selectedData as DataMap[K],
      loading: false,
      error: selectedData ? null : 'Data key not found',
    };
  }, [key]);
}
