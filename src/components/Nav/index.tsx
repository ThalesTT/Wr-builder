import styles from './styles.module.css';
import { Link } from 'react-router-dom';

export function Nav() {
  return (
    <nav className={styles['navList-header']}>
      <Link to={'/'}>Campeões</Link>
      <Link to={'/build'}>Minhas builds</Link>
    </nav>
  );
}
