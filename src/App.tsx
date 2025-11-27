import './styles/theme.css';
import './styles/global.css';
import { Header } from './components/Header';
import { Champions } from './components/Champions';
import { AllItens } from './components/AllItens';
import { Itens } from './components/Itens';
import { AllChampions } from './components/AllChampions';

export function App() {
  return (
    <>
      <Header />
      {/* <Champions />/ */}
      {/* <AllItens /> */}
      {/* <Itens /> */}
      <AllChampions />
    </>
  );
}
