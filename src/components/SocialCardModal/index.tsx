import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import type { ItemData } from '../../types/Itens';
import type { SelectedRunes } from '../../types/Itens';
import { RunesDisplay } from '../RunesDisplay';

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
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#1e1e1e', // fundo sólido
    });
    const link = document.createElement('a');
    link.download = `${buildName || championSlug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return createPortal(
    <div
      className='modal-overlay'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className='modal-content'
        style={{
          background: 'linear-gradient(135deg, #1e3c72,#2a5298)',
          padding: '1rem',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onClick={e => e.stopPropagation()}
        ref={cardRef}
      >
        {/* Nome da Build */}
        <h2
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '1.3rem',
            marginBottom: '1rem',
            wordBreak: 'break-word',
          }}
        >
          {buildName || `Build de ${championSlug}`}
        </h2>

        {/* Campeão */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <img
            src={`/images/champs/${championSlug}.WEBP`}
            alt={championSlug}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '2px solid #fff',
            }}
          />
        </div>

        {/* Runas */}
        {selectedRunes && <RunesDisplay selectedRunes={selectedRunes} />}
        {/* Itens */}
        <div
          className='item-row'
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            justifyContent: 'center',
            flexWrap: 'nowrap',
          }}
        >
          {selectedItens.map(
            item =>
              item && (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '60px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={`/images/itens/${item.name}.WEBP`}
                    alt={item.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      border: '1px solid #fff',
                    }}
                  />
                  <span
                    style={{
                      color: 'white',
                      fontSize: '0.7rem',
                      wordBreak: 'break-word',
                      marginTop: '0.25rem',
                      width: '60px',
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              ),
          )}
        </div>
        {/* Botão de download */}
        <button
          data-html2canvas-ignore
          onClick={handleDownload}
          style={{
            marginTop: '1rem',
            padding: '0.4rem 0.6rem',
            background: '#ffd700',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          Baixar
        </button>

        {/* Responsividade: scroll horizontal só em telas pequenas */}
        <style>
          {`
            @media (min-width: 480px) {
              .item-row {
                overflow-x: unset !important;
              }
            }
          `}
        </style>
      </div>
    </div>,
    document.body,
  );
};
