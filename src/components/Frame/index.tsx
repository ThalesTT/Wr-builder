import styles from './styles.module.css';

export type FrameProps = {
  name: string;
  picture: string;
};

export function Frame({ name, picture }: FrameProps) {
  return (
    <div className={styles.frame}>
      <img src={picture} />
      <p>{name}</p>
    </div>
  );
}
