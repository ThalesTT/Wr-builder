import { Container } from '../Container';
import { Frame } from '../Frame';
import { MyButton } from '../MyButton';
import { NavButtons } from '../NavButtons';
import { SearchBar } from '../SearchBar';
import styles from './styles.module.css';
import { useState, useEffect, useMemo } from 'react';

// Definição dos tipos de dados utilizados.
type LANE = 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Sup';
type FilterLane = LANE | 'all'; // O filtro de lane pode ser uma lane específica ou 'all' (todos).

// Interface para um único campeão.
interface championsData {
  name: string;
  lanes: LANE[]; // Um campeão pode ter múltiplas lanes.
}

// Interface para o formato esperado do arquivo JSON.
interface championsJson {
  champ: championsData[]; // O arquivo JSON contém um array sob a chave 'champ'.
}

export function Champions() {
  // 1. Estados do Componente
  const [champions, setChampions] = useState<championsData[]>([]); // Armazena a lista completa de campeões.
  const [laneFilter, setLaneFilter] = useState<FilterLane>('Top'); // Armazena o filtro de rota/lane ativo.
  const [searchName, setSearchName] = useState<string>(''); // Armazena o termo de pesquisa digitado pelo usuário.

  // 2. Efeito de Carregamento de Dados (useEffect)
  useEffect(() => {
    // Busca os dados dos campeões do arquivo champions.json.
    fetch('/data/champions.json')
      .then(response => {
        // Verifica se a resposta HTTP foi bem-sucedida.
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Converte a resposta para JSON e a tipa.
        return response.json() as Promise<championsJson>;
      })
      .then(data => setChampions(data.champ)); // Atualiza o estado com o array de campeões.
    // O array de dependências vazio ([]) garante que este efeito rode apenas uma vez,
    // após a montagem inicial do componente.
  }, []);

  // 3. Lógica de Filtragem por Lane (useMemo)
  const championsRender = useMemo(() => {
    // Filtra a lista completa de campeões com base no 'laneFilter'.
    return champions.filter(champion => {
      // Se o filtro for 'all', retorna todos os campeões.
      if (laneFilter === 'all') {
        return true;
      }
      // Se não for 'all', retorna apenas os campeões que incluem a lane filtrada.
      return champion.lanes.includes(laneFilter);
    });
    // Este cálculo só será refeito se 'champions' (dados originais) ou 'laneFilter' (estado) mudar.
  }, [champions, laneFilter]);

  // 4. Lógica de Filtragem por Nome (useMemo)
  const championNameRender = useMemo(() => {
    // Filtra a lista completa de campeões com base no 'searchName'.
    return champions.filter(champion => {
      // Prepara o termo de pesquisa (minúsculas e sem espaços extras).
      const normalizedSearchTerm = searchName.toLocaleLowerCase().trim();

      // Se o termo de pesquisa estiver vazio, retorna todos os campeões (não filtra nada).
      if (!normalizedSearchTerm) {
        return true;
      }

      // Prepara o nome do campeão para comparação.
      const normalizedChampionName = champion.name.toLocaleLowerCase();

      // Retorna true se o nome do campeão incluir o termo de pesquisa.
      return normalizedChampionName.includes(normalizedSearchTerm);
    });
    // Este cálculo só será refeito se 'champions' (dados originais) ou 'searchName' (estado) mudar.
  }, [champions, searchName]);

  // 5. Lógica de Seleção Final (useMemo)
  const finalChampions = useMemo(() => {
    // Verifica se o usuário digitou algo na barra de pesquisa.
    const isSearchActive = searchName.trim().length > 0;

    // Se a pesquisa estiver ativa, a lista final é a filtrada por NOME (prioridade).
    if (isSearchActive) {
      return championNameRender;
    }

    // Se a pesquisa não estiver ativa, a lista final é a filtrada por LANE.
    return championsRender;
    // Este cálculo é refeito se qualquer uma das listas filtradas ou o termo de pesquisa mudar.
  }, [championNameRender, championsRender, searchName]);

  // 6. Função de Callback para a Busca
  const handleSearchChange = (newTerm: string) => {
    // Atualiza o estado 'searchName' quando o texto na barra de pesquisa muda.
    setSearchName(newTerm);
  };

  // 7. Renderização Condicional (Loading)
  // Exibe "Carregando..." enquanto a lista de campeões não foi carregada (array vazio).
  if (champions.length < 1) {
    return <div>Carregando...</div>;
  }

  // 8. Renderização Principal (JSX)
  return (
    <>
      {/* Componente para os botões de navegação/filtro de Lane */}
      <NavButtons>
        {/* Botões que definem o filtro de lane (setLaneFilter) */}
        <MyButton variety='top' onClick={() => setLaneFilter('Top')} />
        <MyButton variety='jungle' onClick={() => setLaneFilter('Jungle')} />
        <MyButton variety='mid' onClick={() => setLaneFilter('Mid')} />
        <MyButton variety='adc' onClick={() => setLaneFilter('ADC')} />
        <MyButton variety='sup' onClick={() => setLaneFilter('Sup')} />
        <MyButton variety='all' onClick={() => setLaneFilter('all')} />
      </NavButtons>

      {/* Barra de pesquisa para filtrar por nome */}
      <SearchBar
        placeholder='Digite seu campeão'
        onSearchChange={handleSearchChange} // Passa a função para atualizar o estado.
        searchName={searchName} // Passa o estado atual para o componente SearchBar.
      />

      {/* Container principal para a lista de campeões */}
      <Container>
        <ul className={styles.ul}>
          {/* Mapeia a lista FINAL de campeões (filtrada por lane OU nome) */}
          {finalChampions.map((champion, index) => (
            // Nota: Para melhor performance, seria ideal usar 'key={champion.name}'
            // se o nome for único, em vez de 'key={index}'.
            <li key={index}>
              {/* Componente que exibe a imagem e o nome do campeão */}
              <Frame
                name={champion.name}
                // Constrói o caminho da imagem baseado no nome do campeão.
                picture={`/images/champs/${champion.name}.WEBP`}
              />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
