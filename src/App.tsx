import './styles/theme.css';
import './styles/global.css';
import { Router } from './components/MainRouter/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router></Router>
      </QueryClientProvider>
    </>
  );
}
