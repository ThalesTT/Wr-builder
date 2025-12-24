import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '../Container';
import { ItemFilterControls } from '../ItemFilterControls';
import { ItemDisplay } from '../ItemDisplay';
import { BuildDisplay } from '../BuildDisplay';
import { useItemCatalog } from '../hooks/useItemCatalog';
import { useBuildFromUrl } from '../hooks/useBuildFromUrl';
import { useBuildManager } from '../hooks/useBuildManager';
import { SocialCardModal } from '../SocialCardModal'; // import do modal
import type { FilterType, ItemData } from '../../types/Itens';

export function Allitens() {
  const { champion } = useParams<{ champion: string }>();
  const championSlug = champion ?? 'Garen';

  const { items, catalogMap } = useItemCatalog();
  const { ids, buildName, setBuildName } = useBuildFromUrl();
  const {
    selectedItens,
    activeSlotIndex,
    buildItemIds,
    addItem,
    removeItem,
    setActiveSlotIndex,
  } = useBuildManager(ids, catalogMap);

  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  const [searchName, setSearchName] = useState('');
  const [usePortugueseName, setUsePortugueseName] = useState(
    navigator.language.toLowerCase().startsWith('pt'),
  );

  const [showCardModal, setShowCardModal] = useState(false);

  const getDisplayName = (item: ItemData) =>
    usePortugueseName ? item.nome : item.name;

  const finalItens = items
    .filter(item => itemFilter === 'all' || item.type === itemFilter)
    .filter(item => {
      const term = searchName.trim().toLowerCase();
      if (!term) return true;
      return getDisplayName(item).toLowerCase().includes(term);
    });

  const handleSearchChange = (term: string) => setSearchName(term);

  const handleExportClick = () => {
    setShowCardModal(true); // abre o modal
  };

  const handleSaveUrl = () => {
    const ALL_BUILDS_KEY = 'wrBuilderAllSavedUrls';
    const savedUrl = {
      id: Date.now().toString(),
      name:
        buildName ||
        `Build de ${championSlug} (${new Date().toLocaleDateString()})`,
      url: `${window.location.pathname}?ids=${buildItemIds.join(
        ',',
      )}&bd=${encodeURIComponent(buildName)}`,
      savedAt: Date.now(),
    };

    const saved = localStorage.getItem(ALL_BUILDS_KEY);
    const arr = saved ? JSON.parse(saved) : [];
    arr.push(savedUrl);
    localStorage.setItem(ALL_BUILDS_KEY, JSON.stringify(arr));

    alert(`Build "${savedUrl.name}" salva localmente!`);
  };

  return (
    <>
      <ItemFilterControls
        setItemFilter={setItemFilter}
        usePortugueseName={usePortugueseName}
        setUsePortugueseName={setUsePortugueseName}
        searchName={searchName}
        handleSearchChange={handleSearchChange}
      />

      <ItemDisplay
        finalItens={finalItens}
        getDisplayName={getDisplayName}
        handleFrameClick={addItem}
      />

      <Container>
        <button onClick={handleExportClick}>Exportar</button>
        <button onClick={handleSaveUrl}>Salvar</button>

        <BuildDisplay
          championName={championSlug}
          champion={championSlug}
          buildName={buildName}
          setBuildName={setBuildName}
          selectedItens={selectedItens}
          activeSlotIndex={activeSlotIndex}
          getDisplayName={getDisplayName}
          handleSlotClick={setActiveSlotIndex}
          handleRemoveItem={removeItem}
        />
      </Container>

      {/* Modal Social Card */}
      <SocialCardModal
        championSlug={championSlug}
        buildName={buildName}
        selectedItens={selectedItens.filter(
          (item): item is ItemData => item !== null,
        )}
        show={showCardModal}
        onClose={() => setShowCardModal(false)}
      />
    </>
  );
}
