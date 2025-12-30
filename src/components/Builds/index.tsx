import { useEffect, useState } from 'react';
import type { ItemData, SavedUrl } from '../../types/Itens';
import { Link } from 'react-router-dom';
import { BuildPreview } from '../BuildPreview';
import { RunesDisplay } from '../RunesDisplay';
import type { Rune, SelectedRunes } from '../../types/runes';
import styles from './styles.module.css';

interface BuildsProps {
  itemCatalog: ItemData[];
  runesCatalog: Rune[];
}

export function Builds({ itemCatalog, runesCatalog }: BuildsProps) {
  // Estado que armazena a lista de builds recuperadas do LocalStorage
  const [savedBuilds, setSavedBuilds] = useState<SavedUrl[]>([]);

  /**
   * 1. EXTRAÇÃO DE ITENS
   * Recebe a URL salva (ex: /itens/Ahri?ids=1,2,3) e devolve um array de números [1, 2, 3].
   */
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

  /**
   * 2. EXTRAÇÃO DO CAMPEÃO
   * Pega o final da rota antes dos parâmetros (ex: /itens/Lux -> Lux).
   */
  const extractChampionName = (url: string): string => {
    const path = url.split('?')[0];
    const pathParts = path.split('/');
    const champion = pathParts[pathParts.length - 1];
    return champion || 'no-champion';
  };

  /**
   * 3. EXTRAÇÃO DE RUNAS
   * Converte os parâmetros 'k' (keystone), 's' (secondary) e 'e' (extra)
   * da URL nos nomes das runas usando o catálogo carregado.
   */
  const extractRunesFromUrl = (url: string): SelectedRunes => {
    const defaultRunes: SelectedRunes = {
      keystone: null,
      secondaryTreeId: 'secondary',
      secondary: { 1: '', 2: '', 3: '' },
      extra: null,
    };

    try {
      const queryString = url.split('?')[1];
      if (!queryString) return defaultRunes;

      const params = new URLSearchParams(queryString);
      const kId = params.get('k');
      const sIds = params.get('s')?.split(',') || [];
      const eId = params.get('e');

      // Busca os objetos de runa no catálogo para pegar os nomes reais
      const kRune = runesCatalog.find(r => r.id === Number(kId));
      const s1 = runesCatalog.find(r => r.id === Number(sIds[0]));
      const s2 = runesCatalog.find(r => r.id === Number(sIds[1]));
      const s3 = runesCatalog.find(r => r.id === Number(sIds[2]));
      const eRune = runesCatalog.find(r => r.id === Number(eId));

      return {
        keystone: kRune ? kRune.name : null,
        secondary: {
          1: s1 ? s1.name : '',
          2: s2 ? s2.name : '',
          3: s3 ? s3.name : '',
        },
        extra: eRune ? eRune.name : null,
        secondaryTreeId: 'secondary',
      };
    } catch (e) {
      console.error('Erro ao processar runas:', e);
      return defaultRunes;
    }
  };

  /**
   * 4. CICLO DE VIDA (Carregamento)
   * Busca no LocalStorage todas as builds salvas assim que o componente monta.
   * Ordena pelas mais recentes (savedAt).
   */
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

  /**
   * 5. EXCLUSÃO
   * Remove a build do estado e atualiza o LocalStorage.
   */
  const handleRemoverBuild = (idToRemove: string) => {
    const updatedBuilds = savedBuilds.filter(build => build.id !== idToRemove);
    localStorage.setItem(
      'wrBuilderAllSavedUrls',
      JSON.stringify(updatedBuilds),
    );
    setSavedBuilds(updatedBuilds);
  };

  // Helper para exibir data e hora legíveis
  const formatarData = (timestamp: number) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      ' ' +
      new Date(timestamp).toLocaleTimeString()
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>💾 Minhas Builds Salvas</h1>

      {/* Loading states */}
      {(itemCatalog.length === 0 || runesCatalog.length === 0) && (
        <p>Carregando dados...</p>
      )}

      {savedBuilds.length === 0 ? (
        <p>Você não tem nenhuma build salva localmente.</p>
      ) : (
        <ul className={styles.buildList}>
          {savedBuilds.map(build => {
            // Para cada build salva, processamos a URL para obter os dados visuais
            const itemIds = extractItemIdsFromUrl(build.url);
            const championSlug = extractChampionName(build.url);
            const selectedRunes = extractRunesFromUrl(build.url);

            return (
              <li key={build.id} className={styles.buildItem}>
                {/* Título da Build: Ao clicar, o Link leva o usuário de volta para a edição */}
                <Link to={build.url} className={styles.buildName}>
                  <h2>{build.name}</h2>
                </Link>

                {/* Miniatura visual da Build (Itens e Campeão) */}
                <BuildPreview
                  selectedRunes={selectedRunes}
                  itemIds={itemIds}
                  itemCatalog={itemCatalog}
                  champion={championSlug}
                />

                {/* Exibição das runas selecionadas nesta build específica */}
                <RunesDisplay selectedRunes={selectedRunes} />

                <p className={styles.saveInfo}>
                  Salvo em: {formatarData(build.savedAt)}
                </p>

                <button
                  className={styles.deleteButton}
                  onClick={() => handleRemoverBuild(build.id)}
                >
                  Remover Build
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
