import { useEffect, useState } from 'react';
import type { ItemData, SavedUrl } from '../../types/Itens';
import { Link } from 'react-router-dom';
import { BuildPreview } from '../BuildPreview';

const ALL_BUILDS_KEY = 'wrBuilderAllSavedUrls';

// interface buildProps {
//   itemCatalog: ItemData[]
//   runesCatalog: ''
// }

export function Builds({ itemCatalog }: { itemCatalog: ItemData[] }) {
  const [savedBuilds, setSavedBuilds] = useState<SavedUrl[]>([]);

  // Função para extrair os itens da URL
  const extractItemIdsFromUrl = (url: string): number[] => {
    try {
      const queryString = url.split('?')[1];
      if (!queryString) return [];

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

  // Função para extrair o nome do campeão da URL
  const extractChampionName = (url: string): string => {
    const path = url.split('?')[0];
    const pathParts = path.split('/');
    const champion = pathParts[pathParts.length - 1];
    return champion || 'Ahri';
  };

  // Função para extrair as runas da URL
  const extractRunesFromUrl = (url: string) => {
    const params = new URLSearchParams(url.split('?')[1]);
    const runesString = params.get('runes');

    if (runesString) {
      const runesArray = runesString.split(',');
      const keystone = runesArray[0];
      const secondary = runesArray.slice(1, 4);
      const extra = runesArray[4];

      return {
        keystone,
        secondary: {
          1: secondary[0] || '',
          2: secondary[1] || '',
          3: secondary[2] || '',
        },
        extra: extra || '',
        secondaryTreeId: 'secondary', // Você pode ajustar conforme sua necessidade
      };
    }

    return {
      keystone: '',
      secondary: { 1: '', 2: '', 3: '' },
      extra: '',
      secondaryTreeId: 'secondary',
    };
  };

  // Carregar builds salvas do localStorage
  useEffect(() => {
    const loadBuilds = () => {
      try {
        const savedUrlsJson = localStorage.getItem(ALL_BUILDS_KEY);
        if (savedUrlsJson) {
          const loadedBuilds: SavedUrl[] = JSON.parse(savedUrlsJson);
          loadedBuilds.sort((a, b) => b.savedAt - a.savedAt);
          setSavedBuilds(loadedBuilds);
        }
      } catch (error) {
        console.error('Erro ao carregar builds salvas do LocalStorage:', error);
        setSavedBuilds([]);
      }
    };
    loadBuilds();
  }, []);

  const handleRemoverBuild = (idToRemove: string) => {
    const updatedBuilds = savedBuilds.filter(build => build.id !== idToRemove);

    try {
      localStorage.setItem(ALL_BUILDS_KEY, JSON.stringify(updatedBuilds));
      setSavedBuilds(updatedBuilds);
    } catch (error) {
      console.error('Falha ao remover build:', error);
    }
  };

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

      {savedBuilds.length === 0 && (
        <p>Você não tem nenhuma build salva localmente.</p>
      )}

      {itemCatalog.length > 0 && savedBuilds.length > 0 && (
        <ul>
          {savedBuilds.map(build => {
            const itemIds = extractItemIdsFromUrl(build.url);
            const championSlug = extractChampionName(build.url);
            const selectedRunes = extractRunesFromUrl(build.url); // Extraindo as runas da URL

            return (
              <li key={build.id}>
                <Link to={build.url}>
                  <h2>{build.name}</h2>
                </Link>

                {/* Exibindo os Itens e as Runas */}
                <BuildPreview
                  selectedRunes={selectedRunes} // Passando as runas para o BuildPreview
                  itemIds={itemIds}
                  itemCatalog={itemCatalog}
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
