import styles from './styles.module.css';

type ContainerProps = {
  children: React.ReactNode;
};

export function NavButtons({ children }: ContainerProps) {
  return <nav className={styles.nav}>{children}</nav>;
}
