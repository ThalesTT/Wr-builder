// export interface SelectedRunes {
//   keystone: string | null;
//   secondary?: Record<number, string>;
//   extra?: string | null;
// }
// --- Interfaces ---
export interface SelectedRunes {
  keystone: string | null;
  secondaryTreeId: string;
  secondary: Record<number, string>;
  extra: string | null;
}

export interface Rune {
  id: number;
  name: string;
  tier?: number;
}

export interface RunesJson {
  keystones: Rune[];
  dominacao: Rune[];
  inspiracao: Rune[];
  precisao: Rune[];
  determinacao: Rune[];
}
