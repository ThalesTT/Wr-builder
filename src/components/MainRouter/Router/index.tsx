import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom';
import { AllChampions } from '../../AllChampions';
import { Itens } from '../../Itens';
import { useFetchData } from '../../hooks/useFetchData';
import { Builds } from '../../Builds';
import { Allitens } from '../../AllItens';
import type { ItemData } from '../../../types/Itens';
import runesData from '../../../data/runas.json';

export interface Rune {
  id: number;
  name: string;
  nome: string;
  tier?: number;
}

export interface RunesData {
  keystones: Rune[];
  Domination: Rune[];
  Inspiration: Rune[];
  Precision: Rune[];
  Resolve: Rune[];
}

export interface SelectedRunes {
  keystone: Rune | null;
  secondaryTreeId: string;
  secondary: Record<number, Rune>;
  extra: Rune | null;
}

export interface AppContextType {
  itemCatalog: ItemData[];
  runesData: RunesData;
  allRunesFlat: Rune[];
}
// Componente Layout para distribuir os dados via Contexto
function AppLayout({ itemCatalog }: { itemCatalog: ItemData[] }) {
  const runes = runesData as unknown as RunesData;
  // Criamos uma lista "flat" das runas para busca rápida
  const allRunesFlat: Rune[] = [
    ...runesData.keystones,
    ...runesData.Domination,
    ...runesData.Inspiration,
    ...runesData.Precision,
    ...runesData.Resolve,
  ];

  const contextValue: AppContextType = {
    itemCatalog,
    runesData: runes,
    allRunesFlat,
  };
  return <Outlet context={{ contextValue }} />;
}

export function Router() {
  const { data: ItensJson } = useFetchData('itens');
  const itemCatalog: ItemData[] = ItensJson?.itens || [];

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout itemCatalog={itemCatalog} />}>
          <Route path='*' element={<AllChampions />} />
          <Route path='/' element={<AllChampions />} />
          <Route path='/itens/:champion' element={<Itens />} />
          <Route path='/allitens/:champion' element={<Allitens />} />
          <Route path='/build' element={<Builds itemCatalog={itemCatalog} />} />
          <Route path='/runas' element={<Itens />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
