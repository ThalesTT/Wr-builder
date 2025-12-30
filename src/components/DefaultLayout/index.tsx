import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';

export function DefaultLayout() {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <Header />

      {/* O padding-top deve ser a altura do seu Header para não cobrir o conteúdo */}
      <main style={{ flex: 1, paddingTop: '40px', paddingBottom: '40px' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
