import './styles/theme.css';
import './styles/global.css';
import { Header } from './components/Header';
import { NavChamp } from './components/NavChamp';
import { Champions } from './components/Champions';

export function App() {
  return (
    <>
      <Header />
      <NavChamp />
      <Champions />
    </>
  );
}
