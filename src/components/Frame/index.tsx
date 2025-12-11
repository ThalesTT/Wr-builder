import styles from './styles.module.css';

const frames = {
  champion: styles.champion,
  item: styles.item,
  build: styles['item-in-build'],
};
export type FrameProps = {
  name: string;
  picture: string;
  remove?: boolean;
  onClick?: () => void;
  classStyles: keyof typeof frames;
};

export function Frame({
  name,
  picture,
  onClick,
  remove,
  classStyles,
}: FrameProps) {
  if (remove) {
    return (
      <div className={styles.frame}>
        <div className={frames[classStyles]}>
          <button onClick={onClick}>X</button>
          <img src={picture} />
          <p className={styles.nome}>{name}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.frame} onClick={onClick}>
      <div className={frames[classStyles]}>
        <img src={picture} />
        <p className={styles.nome}>{name}</p>
      </div>
    </div>
  );
}
