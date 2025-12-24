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
  searchName,
  handleSearchChange,
}: ItemFilterControlsProps) {
  return (
    <>
      <Header />
      <NavButtons>
        <MyButton
          variety='mage'
          onClick={() => setItemFilter('magic')}
          isActive={false}
        />
        <MyButton
          variety='adc'
          onClick={() => setItemFilter('attack')}
          isActive={false}
        />
        <MyButton
          variety='tank'
          onClick={() => setItemFilter('defense')}
          isActive={false}
        />
        <MyButton
          variety='sup'
          onClick={() => setItemFilter('sup')}
          isActive={false}
        />
        <MyButton
          variety='all'
          onClick={() => setItemFilter('all')}
          isActive={false}
        />
        <MyButton
          variety='all'
          onClick={() => setItemFilter('boots')}
          isActive={false}
        />
        <MyButton
          variety='all'
          onClick={() => setItemFilter('enchant')}
          isActive={false}
        />
        <MyButton variety={'tank'} isActive={false} />
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
