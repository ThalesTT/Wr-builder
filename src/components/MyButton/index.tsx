import styles from './styles.module.css';

const Variety = {
  adc: 'ADC',
  jungle: 'Jungle',
  mid: 'MID',
  top: 'TOP',
  sup: 'SUP',
  assa: 'assassin',
  tank: 'tank',
  mage: 'mage',
  shoo: 'shooter',
  heal: 'support',
  all: 'all',
};

type MyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variety: keyof typeof Variety;
};

export function MyButton({ onClick, variety }: MyButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      {Variety[variety]}
      <img
        alt={`${Variety[variety]} lane`}
        src={`/images/lanes/${Variety[variety]}.png`}
        width={30}
        height={30}
      />
    </button>
  );
}
