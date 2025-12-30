// src/hooks/useSound.ts
import { useCallback } from 'react';

// Definimos os tipos de sons disponíveis para evitar erros de digitação
type SoundEffect = 'rune' | 'champion' | 'item' | 'keystone';

const SOUND_PATHS: Record<SoundEffect, string> = {
  rune: '/sounds/rune.wav',
  champion: '/sounds/champion.wav',
  item: '/sounds/item.wav',
  keystone: '/sounds/keystone.wav',
};

export function useSound() {
  const playSound = useCallback((effect: SoundEffect, volume = 0.2) => {
    const audio = new Audio(SOUND_PATHS[effect]);
    audio.volume = volume;

    // O catch é essencial para ignorar erros caso o usuário
    // ainda não tenha interagido com a página (política de autoplay)
    audio.play().catch(() => {
      console.warn(`Audio playback failed for: ${effect}`);
    });
  }, []);

  return { playSound };
}
