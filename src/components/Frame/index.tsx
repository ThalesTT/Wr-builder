import styles from './styles.module.css';

export type FrameProps = {
  name: string;
  picture: string;
  remove: boolean;
  onClick?: () => void;
};

export function Frame({ name, picture, onClick, remove }: FrameProps) {
  console.log(remove);
  if (remove) {
    return (
      <div className={styles.frame}>
        <button onClick={onClick}>X</button>
        <img src={picture} />
        <p>{name}</p>
      </div>
    );
  }
  return (
    <div className={styles.frame} onClick={onClick}>
      <img src={picture} />
      <p>{name}</p>
    </div>
  );
}
