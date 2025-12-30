import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AllChampions } from '../../AllChampions';
import { Itens } from '../../Itens';
import { useFetchData } from '../../hooks/useFetchData';
import { Builds } from '../../Builds';
import type { ItemData } from '../../../types/Itens';
import type { Rune, RunesJson } from '../../../types/runes';
import { DefaultLayout } from '../../DefaultLayout';

export function Router() {
  /**
   * BUSCA DE DADOS GLOBAIS:
   * O Router carrega os itens e runas aqui para que, ao navegar para a página
   * de "Builds Salvas", os dados já estejam prontos para "traduzir" os IDs das URLs.
   */
  const { data: ItensJson } = useFetchData('itens');
  const itemCatalog: ItemData[] = ItensJson?.itens || [];

  const { data: RunesData } = useFetchData('runes') as { data: RunesJson };

  // Transforma o objeto complexo de runas em um array simples (flat) para facilitar a busca
  const runesCatalog: Rune[] = RunesData
    ? [
        ...RunesData.keystones,
        ...RunesData.dominacao,
        ...RunesData.inspiracao,
        ...RunesData.precisao,
        ...RunesData.determinacao,
      ]
    : [];

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          {/* Rota Raiz: Lista de todos os campeões */}
          <Route path='/' element={<AllChampions />} />

          {/* Rota de Montagem de Build: Recebe o nome do campeão como parâmetro dinâmico */}
          <Route path='itens/:champion' element={<Itens />} />

          {/* Rota de Builds Salvas: Passamos os catálogos via props para renderizar os previews */}
          <Route
            path='build'
            element={
              <Builds itemCatalog={itemCatalog} runesCatalog={runesCatalog} />
            }
          />

          {/* Atalho para a interface de runas (que está dentro de Itens) */}
          <Route path='runas' element={<Itens />} />

          {/* 404 / Fallback: Se o usuário digitar qualquer URL inexistente, volta para a Home */}
          <Route path='*' element={<AllChampions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
