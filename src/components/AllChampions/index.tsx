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

// Importa o Custom Hook
import { useSearchAndFilter } from '../useSearchAndFilter';

export function AllChampions() {
  const [champions, setChampions] = useState<championsData[]>([]);
  const [laneFilter, setLaneFilter] = useState<FilterLane>('Top');

  // --- NOVO: Uso do Custom Hook ---
  // O getNameFn é simples aqui: pega o nome da propriedade 'name'.
  const {
    searchTerm: searchName,
    handleSearchChange,
    filteredItems: championsByName,
  } = useSearchAndFilter(champions, champion => champion.name);
  // --------------------------------

  // (useEffect para carregar dados permanece o mesmo)
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

  // 3. Lógica de Filtragem por Lane (Permanece)
  const championsRender = useMemo(() => {
    // ... (lógica de filtro por lane)
    return champions.filter(champion => {
      if (laneFilter === 'all') {
        return true;
      }
      return champion.lanes.includes(laneFilter);
    });
  }, [champions, laneFilter]);

  // 4. Lógica de Seleção Final (Simplificada)
  const finalChampions = useMemo(() => {
    const isSearchActive = searchName.trim().length > 0;

    if (isSearchActive) {
      // Usa a lista fornecida pelo Hook
      return championsByName;
    }

    return championsRender;
  }, [championsByName, championsRender, searchName]); // Alterei de championNameRender para championsByName

  // ... (Renderização Condicional e JSX)

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

      <SearchBar
        placeholder='Digite seu campeão'
        onSearchChange={handleSearchChange} // Handler do Hook
        searchName={searchName} // Estado do Hook
      />
      <Container>
        <ul className={styles.ul}>
          {finalChampions.map(champion => (
            <li key={champion.name}>
              <Frame
                name={champion.name}
                picture={`/images/champs/${champion.name}.WEBP`}
              />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
