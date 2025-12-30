import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Frame } from '../Frame';
import { MyButton, type variety } from '../MyButton';
import { NavButtons } from '../NavButtons';
import { BuildName } from '../BuildName';
import { useFetchData } from '../hooks/useFetchData';
import { useSearchAndFilter } from '../hooks/useSearchAndFilter';
import styles from './styles.module.css';

// Definição das Rotas (Lanes) disponíveis para tipagem
type LANE = 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Sup';
type FilterLane = LANE | 'all';

export function AllChampions() {
  /**
   * 1. BUSCA DE DADOS
   * Utiliza um hook customizado para buscar o JSON de campeões.
   * O useMemo garante que 'champions' só mude se os dados brutos mudarem.
   */
  const { data, loading, error } = useFetchData('champs');

  const champions = useMemo(() => {
    return data?.champ || [];
  }, [data]);

  /**
   * 2. ESTADOS DE FILTRO
   * laneFilter: Armazena qual rota está selecionada no momento (Inicia em 'Mid').
   */
  const [laneFilter, setLaneFilter] = useState<FilterLane>('Mid');

  /**
   * 3. LOGICA DE BUSCA POR TEXTO
   * Utiliza um hook para filtrar a lista 'champions' com base no nome digitado.
   * searchTerm: o valor atual do input.
   * handleSearchChange: função para atualizar o termo de busca.
   * championsByName: a lista já filtrada pelo texto.
   */
  const {
    searchTerm: searchName,
    handleSearchChange,
    filteredItems: championsByName,
  } = useSearchAndFilter(champions, champion => champion.name);

  /**
   * 4. LÓGICA DE FILTRAGEM POR LANE
   * Filtra a lista completa de campeões baseando-se na rota selecionada.
   */
  const championsByLane = useMemo(() => {
    return champions.filter(champion => {
      if (laneFilter === 'all') return true;
      return champion.lanes.includes(laneFilter);
    });
  }, [champions, laneFilter]);

  /**
   * 5. SELEÇÃO DA LISTA FINAL (Prioridade)
   * Se o usuário estiver digitando algo na busca, a busca por nome ignora o filtro de Lane.
   * Caso contrário, exibe os campeões da rota selecionada.
   */
  const finalChampions = useMemo(() => {
    const isSearchActive = searchName.trim().length > 0;
    return isSearchActive ? championsByName : championsByLane;
  }, [championsByName, championsByLane, searchName]);

  // Estados de Interface: Carregamento e Erro
  if (loading) return <div>Carregando campeões...</div>;
  if (error) return <div>Erro ao carregar dados: {error}</div>;

  return (
    <>
      {/* SEÇÃO DE BOTÕES DE FILTRO (Lanes) */}
      <NavButtons>
        {(['Top', 'Jungle', 'Mid', 'ADC', 'Sup', 'all'] as FilterLane[]).map(
          lane => (
            <MyButton
              key={lane}
              variety={lane.toLowerCase() as variety} // Ícone baseado na lane
              isActive={laneFilter === lane} // Realça o botão selecionado
              onClick={() => setLaneFilter(lane)}
            />
          ),
        )}
      </NavButtons>

      {/* CAMPO DE BUSCA POR NOME */}
      <BuildName
        name={searchName}
        placeholder='Digite seu Campeão'
        onNameChange={handleSearchChange}
      />

      {/* GRID DE CAMPEÕES */}
      <div className={styles['champions-container']}>
        <ul className={styles.champions}>
          {finalChampions.map(champion => (
            /* Cada campeão é um link que leva para a página de itens/build */
            <Link to={`/itens/${champion.name}`} key={champion.name}>
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
