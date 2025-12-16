// Frame.tsx (Versão FINAL)
import styles from './styles.module.css';
import { useInView } from 'react-intersection-observer';

// --- Configurações ---
const ROOT_MARGIN_OFFSET = '150px 0px';

const frames = {
  champion: styles.champion,
  item: styles.item,
  build: styles['item-in-build'],
};
type FrameProps = {
  name: string;
  picture: string;
  remove?: boolean;
  onClick?: () => void;
  classStyles: keyof typeof frames;
};

export function Frame({
  name,
  picture,
  onClick,
  remove,
  classStyles,
}: FrameProps) {
  const isLazyLoadable = classStyles === 'item' || classStyles === 'champion';

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: ROOT_MARGIN_OFFSET,
    skip: !isLazyLoadable,
  });

  // --- Conteúdo da Imagem / Placeholder ---
  // Este bloco é o que será dimensionado pelo seu CSS (ex: .item .image-container)
  const ImageOrPlaceholder = () => {
    // Se for Lazy Load e NÃO estiver visível, mostra o placeholder
    if (isLazyLoadable && !inView) {
      return (
        <div
          // Esta div precisa ser dimensionada pelo CSS como se fosse a <img>
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

    // Em todos os outros casos (Imediato, ou Lazy Load visível), mostra a imagem real
    return <img src={picture} alt={name} />;
  };

  // --- Renderização Principal ---
  return (
    <div className={styles.frame} onClick={onClick}>
      <div
        className={frames[classStyles]}
        // Anexamos o ref ao contêiner pai, que define o espaço da imagem e nome.
        // O Flexbox garante que o espaço não salte.
        ref={isLazyLoadable ? ref : null}
      >
        {/* 1. Botão de Remoção (Se existir) */}
        {remove && <button onClick={onClick}>X</button>}

        {/* 2. O Conteúdo da Imagem (Agora com a classe que o CSS espera) */}
        <div className={styles['image-container']}>{ImageOrPlaceholder()}</div>

        {/* 3. O Nome (Obrigatório para o Flexbox) */}
        <p className={styles.nome}>{name}</p>
      </div>
    </div>
  );
}
