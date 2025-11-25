import './styles/theme.css';
import './styles/global.css';
import { Header } from './components/Header';
import { Champions } from './components/Champions';
import { AllItens } from './components/AllItens';

export function App() {
  return (
    <>
      <Header />
      {/* <Itens /> */}
      <AllItens />
      <Champions />
    </>
  );
}
