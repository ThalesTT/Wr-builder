import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AllChampions } from '../../AllChampions';
import { Itens } from '../../Itens';
import { MyBuilds } from '../../MyBuilds';
import { useFetchData } from '../../useFetchData';
import type { ItemData, ItensJson } from '../../../types/Itens';
import { Builds } from '../../Builds';
import { Allitens } from '../../AllItens';

export function Router() {
  const { data: ItensJson } = useFetchData<ItensJson>('data/itens.json');
  const itemCatalog: ItemData[] = ItensJson?.itens || [];

  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<AllChampions />} />
        <Route path='/' element={<AllChampions />} />
        <Route path='/itens/:champion' element={<Itens />} />
        <Route path='/allitens/:champion' element={<Allitens />} />
        <Route path='/mybuilds' element={<MyBuilds />} />
        <Route path='/build' element={<Builds itemCatalog={itemCatalog} />} />
      </Routes>
    </BrowserRouter>
  );
}
