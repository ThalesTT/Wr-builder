import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ItemData } from '../../types/Itens';
import type { SelectedRunes } from '../../types/runes';
import { RunesDisplay } from '../RunesDisplay';
import styles from './styles.module.css'; // Importando os estilos
import html2canvas from 'html2canvas';

interface SocialCardModalProps {
  championSlug: string;
  buildName: string;
  selectedItens: ItemData[];
  selectedRunes: SelectedRunes | null;
  show: boolean;
  onClose: () => void;
}

export const SocialCardModal: React.FC<SocialCardModalProps> = ({
  championSlug,
  buildName,
  selectedItens,
  selectedRunes,
  show,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!show) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;

    // Garante que o elemento seja capturado com largura fixa
    // e sem os limites de scroll do modal
    const element = cardRef.current;

    const canvas = await html2canvas(element, {
      backgroundColor: '#010a13',
      // Mude para 1 se quiser o tamanho idêntico ao do CSS.
      // Mude para 2 se quiser nitidez, mas saiba que a imagem terá o dobro de pixels.
      scale: 1,
      useCORS: true,
      logging: false,
      // Remova o windowWidth e windowHeight, deixe a biblioteca calcular
      // apenas o tamanho do elemento 'cardRef'
      onclone: clonedDoc => {
        // Força o elemento clonado a ser visível e sem scroll
        const modal = clonedDoc.querySelector(
          `.${styles.modalContent}`,
        ) as HTMLElement;
        if (modal) {
          modal.style.maxHeight = 'none';
          modal.style.overflow = 'visible';
        }
      },
    });

    const link = document.createElement('a');
    link.download = `${buildName || championSlug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
        ref={cardRef}
      >
        <h2 className={styles.title}>
          {buildName || `Build de ${championSlug}`}
        </h2>

        <div className={styles.championContainer}>
          <img
            src={`/images/champs/${championSlug}.WEBP`}
            alt={championSlug}
            className={styles.championImage}
          />
        </div>
        {selectedRunes && <RunesDisplay selectedRunes={selectedRunes} />}

        <div className={styles.itemRow}>
          {selectedItens.map(
            item =>
              item && (
                <div key={item.id} className={styles.itemCard}>
                  <img
                    src={`/images/itens/${item.name}.WEBP`}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                  <span className={styles.itemName}>{item.nome}</span>
                </div>
              ),
          )}
        </div>

        <button
          data-html2canvas-ignore
          onClick={handleDownload}
          className={styles.downloadButton}
        >
          Baixar
        </button>
      </div>
    </div>,
    document.body,
  );
};
