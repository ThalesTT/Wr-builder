import styles from './styles.module.css';

type MyButtonProps = {
  lane: string;
  laneImage: string;
};

export function MyButton({ lane, laneImage }: MyButtonProps) {
  return (
    <button className={styles.button}>
      {lane}
      <img alt='' src={laneImage} width={30} height={30} />
    </button>
  );
}
