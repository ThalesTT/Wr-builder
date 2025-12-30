import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useSearchParams, type Params } from 'react-router-dom';
import { useFetchData } from '../hooks/useFetchData';
import { ItemFilterControls } from '../ItemFilterControls';
import { ItemDisplay } from '../ItemDisplay';
import { BuildDisplay } from '../BuildDisplay';
import { Runes } from '../Runes';
import { SocialCardModal } from '../SocialCardModal';
import { CustomAlert } from '../CustomAlert';
import { useSound } from '../hooks/useSound';

// Dados e Tipagens
import runesData from '../../data/runes.json';
import type { FilterType, ItemData, ChampionParam } from '../../types/Itens';
import type { SelectedRunes } from '../../types/runes';
import styles from './styles.module.css';

// --- Constantes de Configuração ---
const ALL_BUILDS_KEY = 'wrBuilderAllSavedUrls';
const MAX_BUILD_SIZE = 7;
const BOOTS_SLOT_INDEX = 5;
const ENCHANT_SLOT_INDEX = 6;

/**
 * Helper: Transforma o JSON de runas em uma lista única para busca rápida por ID ou Nome
 */
const allRunesFlat = [
  ...runesData.keystones,
  ...runesData.dominacao,
  ...runesData.inspiracao,
  ...runesData.precisao,
  ...runesData.determinacao,
];

const findRuneIdByName = (name: string | null) =>
  allRunesFlat.find(r => r.name === name)?.id;

const findRuneNameById = (id: number) =>
  allRunesFlat.find(r => r.id === id)?.name || null;

export function Itens() {
  // --- Hooks de Rota e Áudio ---
  const [searchParams] = useSearchParams();
  const { champion } = useParams<ChampionParam & Params>();
  const championSlug = champion ?? 'no-champion';
  const { playSound } = useSound();

  // --- Estados de Dados ---
  const [itens, setItens] = useState<ItemData[]>([]);
  const { data: itensJson } = useFetchData('itens');

  // --- Estados de Interface ---
  const [itemFilter, setItemFilter] = useState<FilterType>('attack');
  const [searchName, setSearchName] = useState('');
  const [buildName, setBuildName] = useState('');
  const [showRunes, setShowRunes] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [showCardModal, setShowCardModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ show: false, msg: '' });

  // --- Estado da Build (Itens e Runas) ---
  const [selectedItens, setSelectedItens] = useState<(ItemData | null)[]>(() =>
    new Array(MAX_BUILD_SIZE).fill(null),
  );
  const [selectedRunes, setSelectedRunes] = useState<SelectedRunes>({
    keystone: '',
    secondaryTreeId: '',
    secondary: {},
    extra: '',
  });

  // --- Refs para Estabilidade ---
  // Usamos ref para que o handleFrameClick sempre saiba qual slot está ativo sem recriar a função
  const activeSlotRef = useRef(activeSlotIndex);
  useEffect(() => {
    activeSlotRef.current = activeSlotIndex;
  }, [activeSlotIndex]);

  // --- Localização e Tradução ---
  const isPortugueseBr = useMemo(
    () => navigator.language.toLowerCase().startsWith('pt'),
    [],
  );
  const [usePortugueseName, setUsePortugueseName] = useState(isPortugueseBr);

  const getDisplayName = useCallback(
    (item: ItemData) => (usePortugueseName ? item.nome : item.name),
    [usePortugueseName],
  );

  // Mapa para busca rápida de itens por ID (O(1))
  const catalogMap = useMemo(
    () => new Map(itens.map(item => [item.id, item])),
    [itens],
  );

  useEffect(() => {
    if (itensJson?.itens) setItens(itensJson.itens);
  }, [itensJson]);

  // --- Sincronização Inicial (URL -> Estado) ---
  useEffect(() => {
    // 1. Carregar Itens da URL
    const idsString = searchParams.get('ids');
    if (idsString && catalogMap.size > 0) {
      const parsedIds = idsString
        .split(',')
        .map(id => parseInt(id, 10))
        .filter(id => !isNaN(id));
      const newItems: (ItemData | null)[] = new Array(MAX_BUILD_SIZE).fill(
        null,
      );

      parsedIds.forEach((id, index) => {
        if (index < MAX_BUILD_SIZE && catalogMap.has(id)) {
          newItems[index] = catalogMap.get(id)!;
        }
      });
      setSelectedItens(newItems);
      // Foca no próximo slot vazio
      const nextEmpty = newItems.findIndex(item => item === null);
      setActiveSlotIndex(nextEmpty !== -1 ? nextEmpty : 0);
    }

    // 2. Carregar Nome da Build
    const bd = searchParams.get('bd');
    if (bd) setBuildName(bd);

    // 3. Carregar Runas da URL
    const kId = searchParams.get('k');
    const sIds = searchParams.get('s');
    const eId = searchParams.get('e');

    if (kId || sIds || eId) {
      setSelectedRunes(prev => ({
        ...prev,
        keystone: kId ? findRuneNameById(parseInt(kId)) : prev.keystone,
        secondary: sIds
          ? sIds.split(',').reduce((acc, id, idx) => {
              const name = findRuneNameById(parseInt(id));
              if (name) acc[idx + 1] = name;
              return acc;
            }, {} as Record<number, string>)
          : prev.secondary,
        extra: eId ? findRuneNameById(parseInt(eId)) : prev.extra,
      }));
    }
  }, [searchParams, catalogMap]);

  /**
   * FUNÇÃO: Gera a URL interna com base no estado atual para salvar/compartilhar
   */
  const getInternalUrl = useCallback(() => {
    const params = new URLSearchParams();
    const itemIds = selectedItens
      .filter((i): i is ItemData => i !== null)
      .map(i => i.id);

    if (itemIds.length) params.set('ids', itemIds.join(','));
    if (buildName.trim()) params.set('bd', buildName.trim());

    const kId = findRuneIdByName(selectedRunes.keystone);
    if (kId) params.set('k', kId.toString());

    const secIds = Object.values(selectedRunes.secondary)
      .map(name => findRuneIdByName(name))
      .filter(Boolean);
    if (secIds.length) params.set('s', secIds.join(','));

    const eId = findRuneIdByName(selectedRunes.extra);
    if (eId) params.set('e', eId.toString());

    return `${window.location.pathname}?${params.toString()}`;
  }, [selectedItens, buildName, selectedRunes]);

  /**
   * LÓGICA: Adicionar Item na Build (Regras de Negócio)
   */
  const handleFrameClick = useCallback(
    (itemToAdd: ItemData) => {
      setSelectedItens(prev => {
        // 1. Não permite duplicatas
        if (prev.some(item => item?.id === itemToAdd.id)) return prev;

        const newItems = [...prev];
        let targetIndex = activeSlotRef.current;

        // 2. Regra Suporte: Apenas 1 item de suporte
        if (
          itemToAdd.type === 'sup' &&
          prev.some((item, i) => item?.type === 'sup' && i < BOOTS_SLOT_INDEX)
        ) {
          return prev;
        }

        // 3. Direcionamento Automático por Tipo
        if (itemToAdd.type === 'boots') targetIndex = BOOTS_SLOT_INDEX;
        else if (itemToAdd.type === 'enchant') targetIndex = ENCHANT_SLOT_INDEX;
        else if (targetIndex >= BOOTS_SLOT_INDEX) {
          // Se o usuário clicar num item comum mas estiver com o slot de bota focado,
          // tenta achar o primeiro slot livre de item comum.
          const firstEmpty = prev.findIndex(
            (item, i) => item === null && i < BOOTS_SLOT_INDEX,
          );
          if (firstEmpty !== -1) targetIndex = firstEmpty;
          else return prev;
        }

        playSound('item');
        newItems[targetIndex] = itemToAdd;

        // Move o foco para o próximo slot de item comum vazio
        const nextActive = newItems.findIndex(
          (item, i) => item === null && i < BOOTS_SLOT_INDEX,
        );
        setActiveSlotIndex(nextActive !== -1 ? nextActive : 0);

        return newItems;
      });
    },
    [playSound],
  );

  /**
   * LÓGICA: Remover Item
   */
  const handleRemoveItem = useCallback((index: number) => {
    setSelectedItens(prev => {
      const newItems = [...prev];
      newItems[index] = null;
      return newItems;
    });
    setActiveSlotIndex(index); // Foca no slot que acabou de ser limpo
  }, []);

  /**
   * FILTRO: Processa a lista de itens para exibição (Busca vs Categorias)
   */
  const finalItens = useMemo(() => {
    const term = searchName.toLowerCase().trim();
    if (term.length > 0) {
      return itens.filter(item => {
        const namePt = item.nome?.toLowerCase() || '';
        const nameEn = item.name?.toLowerCase() || '';
        return namePt.includes(term) || nameEn.includes(term);
      });
    }
    return itemFilter === 'all'
      ? itens
      : itens.filter(i => i.type === itemFilter);
  }, [itens, itemFilter, searchName]);

  const showAlert = (msg: string) => setAlertConfig({ show: true, msg });
  const closeAlert = () => setAlertConfig({ show: false, msg: '' });

  return (
    <>
      {alertConfig.show && (
        <CustomAlert message={alertConfig.msg} onClose={closeAlert} />
      )}

      {/* Controles superiores: Abas e Busca */}
      <ItemFilterControls
        itemFilter={itemFilter}
        setItemFilter={setItemFilter}
        usePortugueseName={usePortugueseName}
        setUsePortugueseName={setUsePortugueseName}
        searchName={searchName}
        handleSearchChange={setSearchName}
        showRunes={showRunes}
        handleChangeRune={value =>
          setShowRunes(prev => (value !== undefined ? value : !prev))
        }
      />

      {/* Área Central: Ou mostra as Runas ou mostra o Catálogo de Itens */}
      {showRunes ? (
        <Runes onUpdate={setSelectedRunes} initialRunes={selectedRunes} />
      ) : (
        <ItemDisplay
          finalItens={finalItens}
          getDisplayName={getDisplayName}
          handleFrameClick={handleFrameClick}
        />
      )}

      {/* Painel Inferior: Visualização da Build e Ações */}
      <div className={styles.container}>
        <BuildDisplay
          championName={championSlug}
          champion={championSlug}
          buildName={buildName}
          setBuildName={setBuildName}
          selectedItens={selectedItens}
          activeSlotIndex={activeSlotIndex}
          getDisplayName={getDisplayName}
          handleSlotClick={setActiveSlotIndex}
          handleRemoveItem={handleRemoveItem}
          selectedRunes={selectedRunes}
          save={() => {
            const url = getInternalUrl();
            const saved = JSON.parse(
              localStorage.getItem(ALL_BUILDS_KEY) || '[]',
            );
            saved.push({
              savedAt: Date.now(),
              id: Date.now().toString(),
              name: buildName || `Build ${championSlug}`,
              url,
              selectedRunes,
            });
            localStorage.setItem(ALL_BUILDS_KEY, JSON.stringify(saved));
            showAlert('Build Salva com Sucesso!');
          }}
          share={() => {
            const url = getInternalUrl();
            navigator.clipboard.writeText(window.location.origin + url);
            setShowCardModal(true);
            showAlert('Link copiado para a área de transferência!');
          }}
        />

        {/* Modal de Exportação de Imagem */}
        <SocialCardModal
          championSlug={championSlug}
          buildName={buildName}
          selectedItens={selectedItens.filter((i): i is ItemData => i !== null)}
          show={showCardModal}
          onClose={() => setShowCardModal(false)}
          selectedRunes={selectedRunes}
        />
      </div>
    </>
  );
}
