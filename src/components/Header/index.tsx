import { useState } from 'react';
import { Logo } from '../Logo';
import { Nav } from '../Nav';
import styles from './styles.module.css';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.header}>
      <Logo />

      {/* Botão Hamburguer - Estilizado */}
      <button
        className={`${styles.mobileToggle} ${isMenuOpen ? styles.active : ''}`}
        onClick={toggleMenu}
        aria-label='Abrir menu'
      >
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </button>

      {/* Container de Navegação */}
      <div
        className={`${styles.navWrapper} ${isMenuOpen ? styles.menuOpen : ''}`}
      >
        <Nav />
      </div>
    </header>
  );
}
