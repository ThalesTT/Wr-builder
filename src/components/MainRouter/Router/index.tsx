import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AllChampions } from '../../AllChampions';
import { AllItens } from '../../AllItens';
import { Boots } from '../../Boots';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<AllChampions />} />
        <Route path='/' element={<AllChampions />} />
        <Route path='/itens/:champion' element={<AllItens />} />
        <Route path='/boots' element={<Boots />} />
      </Routes>
    </BrowserRouter>
  );
}
