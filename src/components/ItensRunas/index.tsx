import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '../Container';
import { ItemFilterControls } from '../ItemFilterControls';
import { ItemDisplay } from '../ItemDisplay';
import { BuildDisplay } from '../BuildDisplay';
import { SocialCardModal } from '../SocialCardModal';
import { RunesSelector } from '../RuneSelector';
import { useItemCatalog } from '../hooks/useItemCatalog';
import { useBuildFromUrl } from '../hooks/useBuildFromUrl';
import { useBuildManager } from '../hooks/useBuildManager';
import type { FilterType } from '../../types/Itens';
import type { SelectedRunes } from '../../types/runes';
import type { ItemData } from '../../types/Itens';

export function ItensRunas() {
  const { champion } = useParams<{ champion: string }>();
  const championSlug = champion ?? 'Garen';

  // Hooks customizados
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

  // Filtros e busca
  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  const [searchName, setSearchName] = useState('');
  const [usePortugueseName, setUsePortugueseName] = useState(
    navigator.language.toLowerCase().startsWith('pt'),
  );

  // Estado para as runas
  const [selectedRunes, setSelectedRunes] = useState<SelectedRunes>({
    keystone: null,
    primaryTree: null,
    primaryRunes: [],
    secondaryTree: null,
    secondaryRunes: [],
  });

  // Estado do modal do social card
  const [showSocialCard, setShowSocialCard] = useState(false);

  const getDisplayName = (item: any) =>
    usePortugueseName ? item.nome : item.name;

  // Filtragem final combinando tipo e busca
  const finalItens = useMemo(() => {
    return items
      .filter(item => itemFilter === 'all' || item.type === itemFilter)
      .filter(item => {
        const term = searchName.trim().toLowerCase();
        if (!term) return true;
        return getDisplayName(item).toLowerCase().includes(term);
      });
  }, [items, itemFilter, searchName, getDisplayName]);

  // Handlers
  const handleSearchChange = (term: string) => setSearchName(term);

  const handleExportUrl = () => {
    const queryString = buildItemIds.join(',');
    const url = `${
      window.location.origin
    }/itens/${championSlug}?ids=${queryString}&bd=${encodeURIComponent(
      buildName,
    )}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('URL da build copiada para a área de transferência!');
    });
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
      {/* Seletor de runas */}
      <RunesSelector
        selectedRunes={selectedRunes}
        setSelectedRunes={setSelectedRunes}
      />

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
        <button onClick={handleExportUrl}>Exportar</button>
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

      {/* Social Card Modal */}
      <SocialCardModal
        championSlug={championSlug}
        buildName={buildName}
        selectedItens={selectedItens}
        selectedRunes={selectedRunes}
        show={showSocialCard}
        onClose={() => setShowSocialCard(false)}
      />
    </>
  );
}
