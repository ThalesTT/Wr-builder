// AllItens.tsx (Final)

// ... imports (certifique-se de importar os novos hooks) ...
import { useLocalization } from './useLocalization';
import { useItemFiltering } from './useItemFiltering';
import { useBuildState } from './useBuildState';

// ... Tipagens ...

export function AllItens() {
    // 1. Localização
    const localization = useLocalization();
    const { usePortugueseName, setUsePortugueseName, getDisplayName } = localization;

    // 2. Busca e Filtro
    const { 
        itens: allItens, 
        finalItens, 
        loading, 
        error, 
        searchName, 
        setSearchName, 
        setItemFilter 
    } = useItemFiltering(localization);

    // 3. Build State e URL
    const { champion } = useParams();
    const championName: string = champion!;
    
    const { 
        buildName, 
        setBuildName, 
        selectedItens, 
        handleFrameClick, 
        handleRemoveItem 
    } = useBuildState(allItens); // Passa a lista completa de itens

    // O restante do seu código (handlers e JSX) permanece o mesmo,
    // mas agora usa os valores retornados pelos hooks.
    
    // ... Renderização Condicional (loading, error) ...

    return (
        // ... Seu JSX ...
    );
}