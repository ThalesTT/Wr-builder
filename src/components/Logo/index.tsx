import styles from './styles.module.css';
import myImage from '../../assets/images/logo.png';

export function Logo() {
  return (
    <div className={styles.logo}>
      <a href='/'>
        <img src={myImage} alt='' />
      </a>
    </div>
  );
}
