// ItemFilterControls.tsx
import { NavButtons } from '../NavButtons';
import { MyButton } from '../MyButton';
import type { FilterType } from '../../types/Itens';
import { BuildName } from '../BuildName';
import { Header } from '../Header';

interface ItemFilterControlsProps {
  setItemFilter: (filter: FilterType) => void;
  usePortugueseName: boolean;
  setUsePortugueseName: React.Dispatch<React.SetStateAction<boolean>>;
  searchName: string;
  handleSearchChange: (newTerm: string) => void;
}

export function ItemFilterControls({
  setItemFilter,
  usePortugueseName,
  setUsePortugueseName,
  searchName,
  handleSearchChange,
}: ItemFilterControlsProps) {
  return (
    <>
      <Header />
      <NavButtons>
        <MyButton variety='mage' onClick={() => setItemFilter('magic')} />
        <MyButton variety='adc' onClick={() => setItemFilter('attack')} />
        <MyButton variety='tank' onClick={() => setItemFilter('defense')} />
        <MyButton variety='sup' onClick={() => setItemFilter('sup')} />
        <MyButton variety='all' onClick={() => setItemFilter('all')} />
        <MyButton variety='all' onClick={() => setItemFilter('boots')} />
        <MyButton variety='all' onClick={() => setItemFilter('enchant')} />
      </NavButtons>
      {/* <button
        onClick={() => setUsePortugueseName(prev => !prev)}
        style={{ margin: '10px' }}
      >
        Mudar Idioma: {usePortugueseName ? 'Português (ON)' : 'Inglês (OFF)'}
      </button> */}
      <BuildName
        name={searchName}
        onNameChange={handleSearchChange}
        placeholder={
          usePortugueseName ? 'Pesquise seu item (PT)' : 'Search your item (EN)'
        }
      />
    </>
  );
}
