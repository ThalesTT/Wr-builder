import { Button } from '../Button';
import { Logo } from '../Logo';
import { Nav } from '../Nav';
import styles from './styles.module.css';

export function Header() {
  return (
    <>
      <header className={styles.header}>
        <Logo />
        <Nav />
        <Button />
      </header>
    </>
  );
}
