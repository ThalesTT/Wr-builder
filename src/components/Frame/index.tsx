// Frame.tsx (Versão FINAL)
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useInView } from 'react-intersection-observer';

// Define uma margem de 150px para começar a carregar a imagem antes dela aparecer na tela
const ROOT_MARGIN_OFFSET = '150px 0px';

// Mapeamento de classes CSS baseadas no tipo de uso do Frame
const frames = {
  champion: styles.champion,
  item: styles.item,
  build: styles['item-in-build'],
};

type FrameProps = {
  name: string;
  picture: string;
  remove?: boolean; // Exibe ou não o botão "X"
  removeClick?: () => void; // Ação ao clicar no "X"
  onClick?: () => void; // Ação ao clicar no card inteiro
  classStyles: keyof typeof frames; // Determina se é layout de champ, item ou build
};

export function Frame({
  name,
  picture,
  onClick,
  remove,
  removeClick,
  classStyles,
}: FrameProps) {
  // Só aplicamos Lazy Load em listas grandes (Itens e Campeões) para poupar memória
  const isLazyLoadable = classStyles === 'item' || classStyles === 'champion';

  // Define qual imagem mostrar caso o arquivo principal não seja encontrado
  const noImage =
    classStyles === 'item'
      ? '/images/itens/no-item.WEBP'
      : '/images/champs/no-champion.WEBP';

  /**
   * HOOK: useInView
   * Detecta quando o componente entra na tela (viewport).
   * triggerOnce: true garante que, uma vez carregado, não mude mais.
   */
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: ROOT_MARGIN_OFFSET,
    skip: !isLazyLoadable, // Não faz lazy load se for um item da build fixa
  });

  const [currentImg, setCurrentImg] = useState(picture);

  // Sincroniza o estado interno se a imagem mudar via props (ex: trocar bota por encanto)
  useEffect(() => {
    setCurrentImg(picture);
  }, [picture]);

  /**
   * SUB-COMPONENTE: ImageOrPlaceholder
   * Lógica interna para decidir se mostra a <img>, um fallback ou um placeholder cinza.
   */
  const ImageOrPlaceholder = () => {
    // Se ainda não rolou a tela até aqui, mostra uma div cinza com "..."
    if (isLazyLoadable && !inView) {
      return (
        <div
          className={styles['image-container']}
          style={{
            backgroundColor: '#222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
          }}
        >
          ...
        </div>
      );
    }

    // Se visível, renderiza a tag <img> com tratamento de erro
    return (
      <img
        src={currentImg}
        alt={name}
        title={name}
        loading='lazy'
        onError={() => {
          // Fallback: se a imagem der erro 404, tenta carregar a imagem padrão (noImage)
          const fallback = noImage;
          if (currentImg !== fallback) {
            setCurrentImg(fallback);
          } else {
            // Se até a padrão falhar, mostra um pixel transparente (evita ícone de quebrado)
            setCurrentImg(
              'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            );
          }
        }}
      />
    );
  };

  return (
    <div className={styles.frame} onClick={onClick}>
      <div
        className={frames[classStyles]}
        ref={isLazyLoadable ? ref : null} // Onde o observer "vigia" a visibilidade
      >
        {/* 1. BOTÃO DE REMOÇÃO: Usado nos slots da build */}
        {remove && (
          <button
            onClick={e => {
              e.stopPropagation(); // Impede que o clique no "X" selecione o slot
              removeClick?.();
            }}
          >
            X
          </button>
        )}

        {/* 2. CONTAINER DA IMAGEM: Onde a mágica do Lazy Load acontece */}
        <div className={styles['image-container']}>{ImageOrPlaceholder()}</div>

        {/* 3. NOME: Exibido abaixo da imagem */}
        <p className={styles.nome}>{name}</p>
      </div>
    </div>
  );
}
