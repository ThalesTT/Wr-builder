import { Container } from '../Container';
import { Frame } from '../Frame';
import { MyButton } from '../MyButton';
import { NavButtons } from '../NavButtons';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export type LANE = 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Sup';

interface ChampionData {
  name: string;
  lanes: LANE[];
}

interface ChampionsJson {
  champ: ChampionData[];
}
type FilterLane = LANE | 'all';

export function Itens() {
  const [dados, setDados] = useState<ChampionData[]>([]);
  const [laneFilter, setLaneFilter] = useState<FilterLane>('Top');

  useEffect(() => {
    fetch('../../../public/data/champions.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json() as Promise<ChampionsJson>;
      })
      .then(data => setDados(data.champ));
  }, []);

  const champsRender = dados.filter(champion => {
    if (laneFilter === 'all') {
      return true;
    }
    return champion.lanes.includes(laneFilter);
  });

  console.log(dados.length);
  if (dados.length < 1) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <NavButtons>
        <MyButton variety='top' onClick={() => setLaneFilter('Top')} />
        <MyButton variety='jungle' onClick={() => setLaneFilter('Jungle')} />
        <MyButton variety='mid' onClick={() => setLaneFilter('Mid')} />
        <MyButton variety='adc' onClick={() => setLaneFilter('ADC')} />
        <MyButton variety='sup' onClick={() => setLaneFilter('Sup')} />
        <MyButton variety='all' onClick={() => setLaneFilter('all')} />
      </NavButtons>

      <Container>
        <ul className={styles.ul}>
          {champsRender.map((dado, index) => (
            <li key={index}>
              <Frame
                name={dado.name}
                picture={`../../../public/images/champs/${dado.name}.WEBP`}
              />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
