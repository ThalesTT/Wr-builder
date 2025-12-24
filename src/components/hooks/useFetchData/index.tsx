import { useMemo } from 'react';

// Imports dos JSONs diretos do SRC
import itensData from '../../../data/itens.json';
import runesData from '../../../data/runas.json';
import champsData from '../../../data/champions.json';

// --- Interfaces para Tipagem ---
export interface Item {
  id: number;
  name: string;
  nome: string;
  type: 'attack' | 'magic' | 'defense' | 'boots' | 'enchant' | 'sup';
  price: number;
}

export interface Rune {
  name: string;
  nome: string;
  tier?: number;
}

export interface RunesJson {
  keystones: Rune[];
  Domination: Rune[];
  Inspiration: Rune[];
  Precision: Rune[];
  Resolve: Rune[];
}

export interface Champ {
  name: string;
  lanes: string[];
}

// Mapeamento de Tipos para o Hook
interface DataMap {
  itens: { itens: Item[] };
  runes: RunesJson;
  champs: { champ: Champ[] };
}

export function useFetchData<K extends keyof DataMap>(key: K) {
  return useMemo(() => {
    let selectedData: any = null;

    if (key === 'itens') selectedData = itensData;
    if (key === 'runes') selectedData = runesData;
    if (key === 'champs') selectedData = champsData;

    return {
      data: selectedData as DataMap[K],
      loading: false,
      error: selectedData ? null : 'Data key not found',
    };
  }, [key]);
}
