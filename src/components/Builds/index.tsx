import { useEffect, useState } from 'react';
import type { ItemData, SavedUrl } from '../../types/Itens';
import { Link } from 'react-router-dom';
import { BuildPreview } from '../BuildPreview';
// Importe a interface Rune do local correto
import type { Rune } from '../hooks/useFetchData';
import { RunesDisplay } from '../RunesDisplay';
import type { SelectedRunes } from '../Runes';

interface BuildsProps {
  itemCatalog: ItemData[];
  runesCatalog: Rune[];
}

export function Builds({ itemCatalog, runesCatalog }: BuildsProps) {
  const [savedBuilds, setSavedBuilds] = useState<SavedUrl[]>([]);

  // 1. Função para extrair os itens
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
      console.error(e);
    }
    return [];
  };

  // 2. Função para extrair o nome do campeão
  const extractChampionName = (url: string): string => {
    const path = url.split('?')[0];
    const pathParts = path.split('/');
    const champion = pathParts[pathParts.length - 1];
    return champion || 'Ahri';
  };

  // 3. Função para extrair as runas (AGORA DENTRO DO COMPONENTE para usar runesCatalog)
  const extractRunesFromUrl = (url: string): SelectedRunes => {
    const defaultRunes: SelectedRunes = {
      keystone: null,
      secondaryTreeId: 'secondary',
      secondary: {},
      extra: null,
    };
    try {
      const queryString = url.split('?')[1];
      if (!queryString) return defaultRunes;

      const params = new URLSearchParams(queryString);
      const kId = params.get('k');
      const sIds = params.get('s')?.split(',') || [];

      // Buscamos o objeto no catálogo, mas retornamos apenas a propriedade .name (string)
      const kRune = runesCatalog.find(r => r.id === Number(kId));
      const s1 = runesCatalog.find(r => r.id === Number(sIds[0]));
      const s2 = runesCatalog.find(r => r.id === Number(sIds[1]));
      const s3 = runesCatalog.find(r => r.id === Number(sIds[2]));

      return {
        // Retornamos kRune.name (que é uma string) em vez de kRune (que é um objeto)
        keystone: kRune ? kRune.name : null,
        secondary: {
          1: s1 ? s1.name : '',
          2: s2 ? s2.name : '',
          3: s3 ? s3.name : '',
        },
        extra: null,
        secondaryTreeId: 'secondary',
      };
    } catch (e) {
      console.error('Erro ao processar runas:', e);
      return defaultRunes;
    }
  };

  // 4. Carregar do LocalStorage
  useEffect(() => {
    const savedUrlsJson = localStorage.getItem('wrBuilderAllSavedUrls');
    if (savedUrlsJson) {
      try {
        const loadedBuilds: SavedUrl[] = JSON.parse(savedUrlsJson);
        setSavedBuilds(loadedBuilds.sort((a, b) => b.savedAt - a.savedAt));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleRemoverBuild = (idToRemove: string) => {
    const updatedBuilds = savedBuilds.filter(build => build.id !== idToRemove);
    localStorage.setItem(
      'wrBuilderAllSavedUrls',
      JSON.stringify(updatedBuilds),
    );
    setSavedBuilds(updatedBuilds);
  };

  const formatarData = (timestamp: number) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      ' ' +
      new Date(timestamp).toLocaleTimeString()
    );
  };

  // O RETURN deve estar aqui dentro!
  return (
    <div>
      <h1>💾 Minhas Builds Salvas</h1>
      {(itemCatalog.length === 0 || runesCatalog.length === 0) && (
        <p>Carregando dados...</p>
      )}

      {savedBuilds.length === 0 ? (
        <p>Você não tem nenhuma build salva localmente.</p>
      ) : (
        <ul>
          {savedBuilds.map(build => {
            const itemIds = extractItemIdsFromUrl(build.url);
            const championSlug = extractChampionName(build.url);
            const selectedRunes = extractRunesFromUrl(build.url);
            console.log(championSlug);

            return (
              <li
                key={build.id}
                style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}
              >
                <Link to={build.url}>
                  <h2>{build.name}</h2>
                </Link>

                <BuildPreview
                  selectedRunes={selectedRunes}
                  itemIds={itemIds}
                  itemCatalog={itemCatalog}
                  champion={championSlug}
                />

                <RunesDisplay selectedRunes={selectedRunes} />

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
} // FIM DO COMPONENTE BUILDS
