import { useEffect, useState } from 'react';
import type { ItemData, SavedUrl } from '../../types/Itens/';
import { Link } from 'react-router-dom';
import { BuildPreview } from '../BuildPreview';

interface MyBuildsProps {
  itemCatalog: ItemData[];
}

const ALL_BUILDS_KEY = 'wrBuilderAllSavedUrls';

export function Builds({ itemCatalog }: MyBuildsProps) {
  const [savedBuilds, setSavedBuilds] = useState<SavedUrl[]>([]);

  const extractItemIdsFromUrl = (url: string): number[] => {
    try {
      // Encontra a parte da query string (?ids=...)
      const queryString = url.split('?')[1];
      if (!queryString) return [];

      // Cria um objeto URLSearchParams a partir da query
      const params = new URLSearchParams(queryString);
      const idsString = params.get('ids');

      if (idsString) {
        return idsString
          .split(',')
          .map(id => parseInt(id, 10))
          .filter(id => !isNaN(id));
      }
    } catch (e) {
      console.error('Erro ao analisar URL:', e);
    }
    return [];
  };

  const extractChampionName = (url: string): string => {
    const path = url.split('?')[0];
    const pathParts = path.split('/');
    const champion = pathParts[pathParts.length - 1];
    return champion || 'Ahri';
  };

  useEffect(() => {
    // Função para carregar os dados do LocalStorage
    const loadBuilds = () => {
      try {
        // 1. Tenta obter a string JSON
        const savedUrlsJson = localStorage.getItem(ALL_BUILDS_KEY);

        if (savedUrlsJson) {
          // 2. Converte a string JSON de volta para um array de objetos
          const loadedBuilds: SavedUrl[] = JSON.parse(savedUrlsJson);
          // 3. Ordena pela data mais recente (opcional)
          loadedBuilds.sort((a, b) => b.savedAt - a.savedAt);
          setSavedBuilds(loadedBuilds);
        }
      } catch (error) {
        console.error('Erro ao carregar builds salvas do LocalStorage:', error);
        // Define um array vazio em caso de erro
        setSavedBuilds([]);
      }
    };
    loadBuilds();
  }, []);

  // Handler para remover uma build específica
  const handleRemoverBuild = (idToRemove: string) => {
    const updatedBuilds = savedBuilds.filter(build => build.id !== idToRemove);

    try {
      // Salva o novo array sem a build removida
      localStorage.setItem(ALL_BUILDS_KEY, JSON.stringify(updatedBuilds));
      setSavedBuilds(updatedBuilds); // Atualiza o estado da UI
    } catch (error) {
      console.error('Falha ao remover build:', error);
    }
  };

  // Função utilitária para formatar a data
  const formatarData = (timestamp: number) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      ' ' +
      new Date(timestamp).toLocaleTimeString()
    );
  };

  return (
    <div>
      <h1>💾 Minhas Builds Salvas</h1>
      {itemCatalog.length === 0 && <p>Carregando itens...</p>}

      {savedBuilds.length > 0 && savedBuilds.length === 0 && (
        <p>Você não tem nenhuma build salva localmente.</p>
      )}
      {itemCatalog.length > 0 && savedBuilds.length > 0 && (
        <ul>
          {savedBuilds.map(build => {
            console.log('URL sendo passada para o Link:', build.url);
            // Mude o nome do estado para savedBuilds
            const itemIds = extractItemIdsFromUrl(build.url); // <--- Extração dos IDs
            const championSlug = extractChampionName(build.url);

            return (
              <li key={build.id}>
                <Link to={build.url}>
                  <h2>{build.name}</h2>
                </Link>
                {/* EXIBIÇÃO VISUAL AQUI */}
                <BuildPreview
                  itemIds={itemIds}
                  itemCatalog={itemCatalog} // Passa o catálogo carregado
                  champion={championSlug}
                />

                <p>Salvo em: {formatarData(build.savedAt)}</p>

                <button onClick={() => handleRemoverBuild(build.id)}>
                  Remover
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
