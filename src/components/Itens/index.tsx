import styles from './styles.module.css';
import { Container } from '../Container';
import { useEffect, useMemo, useState } from 'react';
import { Frame } from '../Frame';
import { NavButtons } from '../NavButtons';
import { MyButton } from '../MyButton';
import { SearchBar } from '../SearchBar';
// TODO lista de champs e itens conforme role e tipo, verificar JSON

// type ChampionsProps = {
//   role: 'Top' | 'Mid' | 'jgl' | 'Adc' | 'Sup';
// };

type ITEM_TYPE = 'attack' | 'magic' | 'defense' | 'sup';
type FilterType = ITEM_TYPE | 'all';

interface ItemData {
  name: string;
  nome: string;
  price: number;
  type: ITEM_TYPE;
}

interface ItensJson {
  itens: ItemData[];
}

export function Itens() {
  const [itens, setItens] = useState<ItemData[]>([]);
  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  const [searchName, setSearchName] = useState<string>('');

  const isPortuguese = useMemo(() => {
    return navigator.language.toLocaleLowerCase().startsWith('pt');
  }, []);

  const getDisplayName = (item: ItemData) => {
    // / Se for Português, usa item.nome. Caso contrário, usa item.name.
    // Garante que o campo correto seja usado para renderização e pesquisa.
    return isPortuguese ? item.nome : item.name;
  };

  useEffect(() => {
    fetch('../../../public/data/itens.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status:${response.status}`);
        }
        return response.json() as Promise<ItensJson>;
      })
      .then(data => setItens(data.itens));
  }, []);

  const itensRender = itens.filter(item => {
    if (itemFilter === 'all') {
      return true;
    }
    return item.type === itemFilter;
  });

  const itensNameRender = itens.filter(item => {
    const normalizedSearchTerm = searchName.toLocaleLowerCase().trim();
    const normalizedItemName = getDisplayName(item).toLocaleLowerCase();

    // Filtra apenas se o nome do item incluir o termo de pesquisa (case-insensitive)
    return normalizedItemName.includes(normalizedSearchTerm);
  });

  const handleSearchChange = (newTerm: string) => {
    setItemFilter('all');
    setSearchName(newTerm);
  };

  return (
    <>
      <NavButtons>
        <MyButton variety='mage' onClick={() => setItemFilter('magic')} />
        <MyButton variety='adc' onClick={() => setItemFilter('attack')} />
        <MyButton variety='tank' onClick={() => setItemFilter('defense')} />
        <MyButton variety='sup' onClick={() => setItemFilter('sup')} />
        <MyButton variety='all' onClick={() => setItemFilter('all')} />
      </NavButtons>
      <SearchBar
        placeholder='Pesquise seu item'
        searchName={searchName}
        onSearchChange={handleSearchChange}
      />
      <Container>
        <ul className={styles.ul}>
          {itemFilter == 'all'
            ? itensNameRender.map((dado, index) => (
                <li key={index}>
                  <Frame
                    // name={dado.nome}
                    name={getDisplayName(dado)}
                    picture={`../../../public/images/itens/${dado.name}.WEBP`}
                  />
                </li>
              ))
            : itensRender.map((dado, index) => (
                <li key={index}>
                  <Frame
                    // name={dado.nome}
                    name={getDisplayName(dado)}
                    picture={`/images/itens/${dado.name}.WEBP`}
                  />
                </li>
              ))}
        </ul>
      </Container>
    </>
  );
}
