import styles from './styles.module.css';
import myImage from '../../assets/images/logo.webp';
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <div className={styles.logo}>
      <Link to={'/'}>
        <img src={myImage} alt='' />
      </Link>
    </div>
  );
}
