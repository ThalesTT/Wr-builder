import './styles/theme.css';
import './styles/global.css';
import { Header } from './components/Header';
import { Container } from './components/Container';

export function App() {
  return (
    <>
      <Header />
      <Container>
        <h2>Olá</h2>
      </Container>
    </>
  );
}
