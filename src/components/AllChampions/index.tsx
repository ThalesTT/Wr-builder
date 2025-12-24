import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Frame } from '../Frame';
import { MyButton } from '../MyButton';
import { NavButtons } from '../NavButtons';
import { Header } from '../Header';
import { BuildName } from '../BuildName';
import { useFetchData } from '../hooks/useFetchData';
import { useSearchAndFilter } from '../hooks/useSearchAndFilter';
import styles from './styles.module.css';

// Tipagens
type LANE = 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Sup';
type FilterLane = LANE | 'all';

export function AllChampions() {
  // 1. Substitui o useEffect e useState de dados pelo Hook customizado
  const { data, loading, error } = useFetchData('champs');
  // Extrai a lista de campeões ou retorna vazio enquanto carrega
  const champions = useMemo(() => {
    return data?.champ || [];
  }, [data]);

  const [laneFilter, setLaneFilter] = useState<FilterLane>('Mid');

  // 2. Uso do Hook de busca (apontando para a lista vinda do useFetchData)
  const {
    searchTerm: searchName,
    handleSearchChange,
    filteredItems: championsByName,
  } = useSearchAndFilter(champions, champion => champion.name);

  // 3. Lógica de Filtragem por Lane
  const championsByLane = useMemo(() => {
    return champions.filter(champion => {
      if (laneFilter === 'all') return true;
      return champion.lanes.includes(laneFilter);
    });
  }, [champions, laneFilter]);

  // 4. Lógica de Seleção Final
  const finalChampions = useMemo(() => {
    const isSearchActive = searchName.trim().length > 0;
    return isSearchActive ? championsByName : championsByLane;
  }, [championsByName, championsByLane, searchName]);

  // Renderizações condicionais de estado
  if (loading) return <div>Carregando campeões...</div>;
  if (error) return <div>Erro ao carregar dados: {error}</div>;

  return (
    <>
      <Header />
      <NavButtons>
        {(['Top', 'Jungle', 'Mid', 'ADC', 'Sup', 'all'] as FilterLane[]).map(
          lane => (
            <MyButton
              key={lane}
              variety={lane.toLowerCase() as any}
              isActive={laneFilter === lane}
              onClick={() => setLaneFilter(lane)}
            />
          ),
        )}
      </NavButtons>

      <BuildName
        name={searchName}
        placeholder='Digite seu Campeão'
        onNameChange={handleSearchChange}
      />

      <div className={styles['champios-container']}>
        <ul className={styles.champions}>
          {finalChampions.map(champion => (
            <Link to={`/allitens/${champion.name}`} key={champion.name}>
              <li>
                <Frame
                  picture={`/images/champs/${champion.name}.WEBP`}
                  name={champion.name}
                  classStyles={'champion'}
                />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}
