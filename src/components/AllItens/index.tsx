// AllItens.tsx (Refatorado para URL Interna)

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, type Params } from 'react-router-dom';
import { useFetchData } from '../hooks/useFetchData';
import { ItemFilterControls } from '../ItemFilterControls';
import { ItemDisplay } from '../ItemDisplay';
import { BuildDisplay } from '../BuildDisplay';
import { Container } from '../Container';
import type {
  FilterType,
  ItemData,
  ChampionParam,
  ItensJson,
  SavedUrl,
} from '../../types/Itens';

const ALL_BUILDS_KEY = 'wrBuilderAllSavedUrls';
const MAX_BUILD_SIZE = 7;
const BOOTS_SLOT_INDEX = 5;
const ENCHANT_SLOT_INDEX = 6;

export function Allitens() {
  // --- Roteamento ---
  const [searchParams] = useSearchParams();
  const { champion } = useParams<ChampionParam & Params>();
  const championSlug = champion ?? 'Garen';

  // --- Estados ---
  const [itens, setItens] = useState<ItemData[]>([]);
  const { data: itensJson } = useFetchData<ItensJson>('/data/itens.json');
  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  const [searchName, setSearchName] = useState('');
  const [buildName, setBuildName] = useState('');
  const [selectedItens, setSelectedItens] = useState<(ItemData | null)[]>(
    new Array(MAX_BUILD_SIZE).fill(null),
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [ids, setIds] = useState<number[]>([]);
  const [buildUrlToSave, setBuildUrlToSave] = useState('');

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

  // --- Leitura inicial da URL (ids) ---
  useEffect(() => {
    const idsString = searchParams.get('ids');
    if (idsString) {
      const parsedIds = idsString
        .split(',')
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));

      const uniqueIds = Array.from(new Set(parsedIds));
      setIds(uniqueIds.slice(0, MAX_BUILD_SIZE));
    } else {
      setIds([]);
    }
  }, [searchParams]);

  // --- Leitura inicial do nome da build ---
  useEffect(() => {
    const bd = searchParams.get('bd');
    if (bd) setBuildName(bd);
  }, [searchParams]);

  // --- Construção da URL interna ---
  useEffect(() => {
    const itemIds = selectedItens
      .filter((item): item is ItemData => item !== null)
      .map(item => item.id);

    const params = new URLSearchParams();

    if (itemIds.length) params.set('ids', itemIds.join(','));
    if (buildName.trim()) params.set('bd', buildName.trim());

    const currentPath = window.location.pathname;
    const queryString = params.toString();
    setBuildUrlToSave(`${currentPath}?${queryString}`);
  }, [selectedItens, buildName]);

  // --- Carrega catálogo ---
  useEffect(() => {
    if (itensJson) setItens(itensJson.itens);
  }, [itensJson]);

  // --- Mapa de catálogo (VALIDAÇÃO DE IDS) ---
  const catalogMap = useMemo(() => {
    return new Map(itens.map(item => [item.id, item]));
  }, [itens]);

  // --- Montagem da build vinda da URL (ROBUSTA) ---
  useEffect(() => {
    if (ids.length > 0 && catalogMap.size > 0) {
      const urlItens: (ItemData | null)[] = new Array(MAX_BUILD_SIZE).fill(
        null,
      );

      const validIds = ids.filter(id => catalogMap.has(id));

      validIds.forEach((id, index) => {
        if (index < MAX_BUILD_SIZE) {
          urlItens[index] = catalogMap.get(id)!;
        }
      });

      setSelectedItens(urlItens);

      const firstEmptyIndex = urlItens.findIndex(item => item === null);
      setActiveSlotIndex(
        firstEmptyIndex !== -1 ? firstEmptyIndex : MAX_BUILD_SIZE - 1,
      );
    } else {
      setSelectedItens(new Array(MAX_BUILD_SIZE).fill(null));
      setActiveSlotIndex(0);
    }
  }, [ids, catalogMap]);

  // --- Handlers ---
  const handleFrameClick = useCallback(
    (itemToAdd: ItemData) => {
      setSelectedItens(prev => {
        const newItems = [...prev];
        let targetIndex = activeSlotIndex;

        if (prev.some(item => item?.name === itemToAdd.name)) return prev;

        if (itemToAdd.type === 'sup') {
          const supExists = prev.some(
            (item, index) => item?.type === 'sup' && index < BOOTS_SLOT_INDEX,
          );
          if (supExists) return prev;
        }

        if (itemToAdd.type === 'boots') targetIndex = BOOTS_SLOT_INDEX;
        else if (itemToAdd.type === 'enchant') targetIndex = ENCHANT_SLOT_INDEX;
        else if (targetIndex >= BOOTS_SLOT_INDEX) {
          const firstEmpty = prev.findIndex(
            (item, index) => item === null && index < BOOTS_SLOT_INDEX,
          );
          if (firstEmpty !== -1) targetIndex = firstEmpty;
          else return prev;
        }

        if (targetIndex < 0 || targetIndex >= MAX_BUILD_SIZE) return prev;

        newItems[targetIndex] = itemToAdd;

        const nextActive = newItems.findIndex(
          (item, index) => item === null && index < BOOTS_SLOT_INDEX,
        );
        setActiveSlotIndex(nextActive !== -1 ? nextActive : 0);

        return newItems;
      });
    },
    [activeSlotIndex],
  );

  const handleExportUrl = useCallback(() => {
    const fullUrl = window.location.origin + buildUrlToSave;
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('URL da build copiada!');
    });
  }, [buildUrlToSave]);

  const handleSaveUrl = useCallback(() => {
    const newSavedUrl: SavedUrl = {
      id: Date.now().toString(),
      name:
        buildName.trim() ||
        `Build de ${championSlug} (${new Date().toLocaleDateString()})`,
      url: buildUrlToSave,
      savedAt: Date.now(),
    };

    const savedUrlsJson = localStorage.getItem(ALL_BUILDS_KEY);
    const existingUrls: SavedUrl[] = savedUrlsJson
      ? JSON.parse(savedUrlsJson)
      : [];

    existingUrls.push(newSavedUrl);
    localStorage.setItem(ALL_BUILDS_KEY, JSON.stringify(existingUrls));

    alert(`Build "${newSavedUrl.name}" salva!`);
  }, [buildName, championSlug, buildUrlToSave]);

  const handleSlotClick = useCallback((index: number) => {
    setActiveSlotIndex(index);
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setSelectedItens(prev => {
      const newItems = [...prev];
      newItems[index] = null;
      return newItems;
    });
    setActiveSlotIndex(index);
  }, []);

  const itensRender = useMemo(() => {
    if (itemFilter === 'all') return itens;
    return itens.filter(item => item.type === itemFilter);
  }, [itens, itemFilter]);

  const itensNameRender = useMemo(() => {
    const term = searchName.toLowerCase().trim();
    if (!term) return itens;
    return itens.filter(item =>
      getDisplayName(item).toLowerCase().includes(term),
    );
  }, [itens, searchName, getDisplayName]);

  const finalItens = useMemo(() => {
    return searchName.trim() ? itensNameRender : itensRender;
  }, [searchName, itensNameRender, itensRender]);

  // --- Render ---
  return (
    <>
      <ItemFilterControls
        setItemFilter={setItemFilter}
        usePortugueseName={usePortugueseName}
        setUsePortugueseName={setUsePortugueseName}
        searchName={searchName}
        handleSearchChange={setSearchName}
      />

      <ItemDisplay
        finalItens={finalItens}
        getDisplayName={getDisplayName}
        handleFrameClick={handleFrameClick}
      />

      <Container>
        <button onClick={handleExportUrl}>Exportar</button>
        <button onClick={handleSaveUrl}>Salvar</button>

        <BuildDisplay
          championName={championName}
          champion={championSlug}
          buildName={buildName}
          setBuildName={setBuildName}
          selectedItens={selectedItens}
          activeSlotIndex={activeSlotIndex}
          getDisplayName={getDisplayName}
          handleSlotClick={handleSlotClick}
          handleRemoveItem={handleRemoveItem}
        />
      </Container>
    </>
  );
}
