// Define os tipos válidos para a propriedade 'type' dos itens.
export type ITEM_TYPE =
  | 'attack'
  | 'magic'
  | 'defense'
  | 'sup'
  | 'boots'
  | 'enchant';
// Define os tipos válidos para o filtro, incluindo 'all' para mostrar todos.
export type FilterType = ITEM_TYPE | 'all';

export interface ItemSlotProps {
  item: ItemData | null;
  index: number;
  isActive: boolean;
  getDisplayName: (item: ItemData) => string;
  handleSlotClick: (index: number) => void;
  handleRemoveItem: (index: number) => void;
}

export interface BuildDisplayProps {
  championName: string;
  champion: string; // O slug do campeão (ex: 'jinx')
  buildName: string;
  setBuildName: (name: string) => void;
  selectedItens: (ItemData | null)[];
  activeSlotIndex: number;
  getDisplayName: (item: ItemData) => string;
  handleSlotClick: (index: number) => void;
  handleRemoveItem: (index: number) => void;
}

// Interface que define a estrutura de um item carregado do JSON.
export interface ItemData {
  image: string;
  name: string; // Nome original (geralmente em inglês)
  nome: string; // Nome em português (para localização)
  price: number;
  id: number;
  type: ITEM_TYPE;
}
export interface SavedUrl {
  id: string;
  name: string;
  url: string; // A URL completa com os parâmetros ?ids=...&bd=...
  savedAt: number;
}
export interface ItensJson {
  itens: ItemData[];
}

// Interface para os parâmetros de rota do campeão
export interface ChampionParam extends Record<string, string | undefined> {
  champion: string;
}

// Constantes
export const MAX_BUILD_SIZE = 7;
export const BOOTS_SLOT_INDEX = 5;
export const ENCHANT_SLOT_INDEX = 6;
export const NORMAL_TYPES: ITEM_TYPE[] = ['attack', 'magic', 'defense', 'sup'];
