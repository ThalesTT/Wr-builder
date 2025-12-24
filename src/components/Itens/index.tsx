import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, type Params } from 'react-router-dom';
import { useFetchData } from '../hooks/useFetchData';
import { ItemFilterControls } from '../ItemFilterControls';
import { ItemDisplay } from '../ItemDisplay';
import { BuildDisplay } from '../BuildDisplay';
import { Container } from '../Container';
import type { FilterType, ItemData, ChampionParam } from '../../types/Itens';
import { Runes, type SelectedRunes } from '../Runes';
import { SocialCardModal } from '../SocialCardModal';
import runesData from '../../data/runas.json';

// --- Constantes e Helpers ---
const ALL_BUILDS_KEY = 'wrBuilderAllSavedUrls';
const MAX_BUILD_SIZE = 7;
const BOOTS_SLOT_INDEX = 5;
const ENCHANT_SLOT_INDEX = 6;

// Lista única para busca rápida de IDs
const allRunesFlat = [
  ...runesData.keystones,
  ...runesData.Domination,
  ...runesData.Inspiration,
  ...runesData.Precision,
  ...runesData.Resolve,
];

const findRuneIdByName = (name: string | null) =>
  allRunesFlat.find(r => r.name === name)?.id;

const findRuneNameById = (id: number) =>
  allRunesFlat.find(r => r.id === id)?.name || null;

export function Itens() {
  // --- Roteamento ---
  const [searchParams] = useSearchParams();
  const { champion } = useParams<ChampionParam & Params>();
  const championSlug = champion ?? 'Garen';

  // --- Estados ---
  const [itens, setItens] = useState<ItemData[]>([]);
  const { data: itensJson } = useFetchData('itens');
  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  const [searchName, setSearchName] = useState('');
  const [buildName, setBuildName] = useState('');
  const [showRunes, setShowRunes] = useState(false); // Ativado o controle
  const [selectedItens, setSelectedItens] = useState<(ItemData | null)[]>(
    new Array(MAX_BUILD_SIZE).fill(null),
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [ids, setIds] = useState<number[]>([]);
  const [buildUrlToSave, setBuildUrlToSave] = useState('');
  const [selectedRunes, setSelectedRunes] = useState<SelectedRunes>({
    keystone: '',
    secondaryTreeId: '',
    secondary: {},
    extra: '',
  });
  const [showCardModal, setShowCardModal] = useState(false);
  const championName = championSlug;

  // --- Localização ---
  const isPortugueseBr = useMemo(
    () => navigator.language.toLocaleLowerCase().startsWith('pt'),
    [],
  );
  const [usePortugueseName, setUsePortugueseName] = useState(isPortugueseBr);

  const getDisplayName = useCallback(
    (item: ItemData) => (usePortugueseName ? item.nome : item.name),
    [usePortugueseName],
  );

  // --- Leitura da URL (Itens e Nome) ---
  useEffect(() => {
    const idsString = searchParams.get('ids');
    if (idsString) {
      const parsedIds = idsString
        .split(',')
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));
      setIds(Array.from(new Set(parsedIds)).slice(0, MAX_BUILD_SIZE));
    }
    const bd = searchParams.get('bd');
    if (bd) setBuildName(bd);
  }, [searchParams]);

  // --- Leitura da URL (Runas por ID) ---
  useEffect(() => {
    const kId = searchParams.get('k');
    const sIds = searchParams.get('s');
    const eId = searchParams.get('e');

    if (kId || sIds || eId) {
      setSelectedRunes(prev => ({
        ...prev,
        keystone: kId ? findRuneNameById(parseInt(kId)) : null,
        secondary: sIds
          ? sIds.split(',').reduce((acc, id, index) => {
              const name = findRuneNameById(parseInt(id));
              if (name) acc[index + 1] = name;
              return acc;
            }, {} as Record<number, string>)
          : {},
        extra: eId ? findRuneNameById(parseInt(eId)) : null,
      }));
    }
  }, [searchParams]);

  // --- Construção da URL interna ---
  useEffect(() => {
    const params = new URLSearchParams();

    // Itens
    const itemIds = selectedItens
      .filter((item): item is ItemData => item !== null)
      .map(item => item.id);
    if (itemIds.length) params.set('ids', itemIds.join(','));
    if (buildName.trim()) params.set('bd', buildName.trim());

    // Runas (Convertendo nome para ID na URL)
    const kId = findRuneIdByName(selectedRunes.keystone);
    if (kId) params.set('k', kId.toString());

    const secValues = Object.values(selectedRunes.secondary).filter(Boolean);
    if (secValues.length) {
      const sIds = secValues
        .map(name => findRuneIdByName(name))
        .filter(Boolean);
      params.set('s', sIds.join(','));
    }

    const eId = findRuneIdByName(selectedRunes.extra);
    if (eId) params.set('e', eId.toString());

    setBuildUrlToSave(`${window.location.pathname}?${params.toString()}`);
  }, [selectedItens, buildName, selectedRunes]);

  // --- Catálogo e Build ---
  useEffect(() => {
    if (itensJson) setItens(itensJson.itens);
  }, [itensJson]);

  const catalogMap = useMemo(
    () => new Map(itens.map(item => [item.id, item])),
    [itens],
  );

  useEffect(() => {
    if (ids.length > 0 && catalogMap.size > 0) {
      const urlItens: (ItemData | null)[] = new Array(MAX_BUILD_SIZE).fill(
        null,
      );
      ids
        .filter(id => catalogMap.has(id))
        .forEach((id, index) => {
          if (index < MAX_BUILD_SIZE) urlItens[index] = catalogMap.get(id)!;
        });
      setSelectedItens(urlItens);
      const firstEmpty = urlItens.findIndex(item => item === null);
      setActiveSlotIndex(firstEmpty !== -1 ? firstEmpty : MAX_BUILD_SIZE - 1);
    }
  }, [ids, catalogMap]);

  // --- Handlers ---
  const handleFrameClick = useCallback(
    (itemToAdd: ItemData) => {
      setSelectedItens(prev => {
        if (prev.some(item => item?.name === itemToAdd.name)) return prev;
        const newItems = [...prev];
        let targetIndex = activeSlotIndex;

        if (itemToAdd.type === 'sup') {
          if (
            prev.some((item, i) => item?.type === 'sup' && i < BOOTS_SLOT_INDEX)
          )
            return prev;
        }

        if (itemToAdd.type === 'boots') targetIndex = BOOTS_SLOT_INDEX;
        else if (itemToAdd.type === 'enchant') targetIndex = ENCHANT_SLOT_INDEX;
        else if (targetIndex >= BOOTS_SLOT_INDEX) {
          const firstEmpty = prev.findIndex(
            (item, i) => item === null && i < BOOTS_SLOT_INDEX,
          );
          if (firstEmpty !== -1) targetIndex = firstEmpty;
          else return prev;
        }

        newItems[targetIndex] = itemToAdd;
        const nextActive = newItems.findIndex(
          (item, i) => item === null && i < BOOTS_SLOT_INDEX,
        );
        setActiveSlotIndex(nextActive !== -1 ? nextActive : 0);
        return newItems;
      });
    },
    [activeSlotIndex],
  );

  const handleRunesUpdate = useCallback((runes: SelectedRunes) => {
    setSelectedRunes(runes);
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setSelectedItens(prev => {
      const newItems = [...prev];
      newItems[index] = null;
      return newItems;
    });
    setActiveSlotIndex(index);
  }, []);

  // --- Filtros ---
  const finalItens = useMemo(() => {
    const term = searchName.toLowerCase().trim();
    const base =
      itemFilter === 'all' ? itens : itens.filter(i => i.type === itemFilter);
    if (term)
      return base.filter(i => getDisplayName(i).toLowerCase().includes(term));
    return base;
  }, [itens, itemFilter, searchName, getDisplayName]);

  return (
    <>
      <ItemFilterControls
        setItemFilter={setItemFilter}
        usePortugueseName={usePortugueseName}
        setUsePortugueseName={setUsePortugueseName}
        searchName={searchName}
        handleSearchChange={setSearchName}
        showRunes={showRunes}
        handleChangeRune={() => setShowRunes(prev => !prev)}
      />

      {/* <button onClick={() => setShowRunes(!showRunes)}>
        {showRunes ? 'Ver Itens' : 'Ver Runas'}
      </button> */}

      {showRunes ? (
        <Runes onUpdate={handleRunesUpdate} initialRunes={selectedRunes} />
      ) : (
        <ItemDisplay
          finalItens={finalItens}
          getDisplayName={getDisplayName}
          handleFrameClick={handleFrameClick}
        />
      )}

      <Container>
        <BuildDisplay
          championName={championName}
          champion={championSlug}
          buildName={buildName}
          setBuildName={setBuildName}
          selectedItens={selectedItens}
          activeSlotIndex={activeSlotIndex}
          getDisplayName={getDisplayName}
          handleSlotClick={setActiveSlotIndex}
          handleRemoveItem={handleRemoveItem}
          selectedRunes={selectedRunes}
        />

        <SocialCardModal
          championSlug={championSlug}
          buildName={buildName}
          selectedItens={selectedItens.filter((i): i is ItemData => i !== null)}
          show={showCardModal}
          onClose={() => setShowCardModal(false)}
          selectedRunes={selectedRunes}
        />
        <Container>
          <button
            onClick={() => {
              setShowCardModal(true);
              navigator.clipboard.writeText(
                window.location.origin + buildUrlToSave,
              );
              alert('URL Copiada!');
            }}
          >
            Exportar
          </button>

          <button
            onClick={() => {
              const saved = JSON.parse(
                localStorage.getItem(ALL_BUILDS_KEY) || '[]',
              );
              saved.push({
                savedAt: Date.now(),
                id: Date.now().toString(),
                name: buildName || `Build ${championSlug}`,
                url: buildUrlToSave,
                selectedRunes,
              });
              localStorage.setItem(ALL_BUILDS_KEY, JSON.stringify(saved));
              alert('Salvo!');
            }}
          >
            Salvar
          </button>
        </Container>
      </Container>
    </>
  );
}
