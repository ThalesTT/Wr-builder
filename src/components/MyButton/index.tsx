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
  isActive: boolean;
};

export function MyButton({ onClick, isActive, variety }: MyButtonProps) {
  // 1. classe principal e a classe condicional
  const buttonClasses = `${styles.buttonBase} ${styles[variety]}`;

  // 2. Aplica o estilo de borda/destaque se isActive for true
  const finalClasses = isActive
    ? `${buttonClasses} ${styles.activeButton}`
    : buttonClasses;

  return (
    <button className={finalClasses} onClick={onClick}>
      <img
        alt={`${Variety[variety]} lane`}
        src={`/images/lanes/${Variety[variety]}.png`}
        width={30}
        height={30}
      />
    </button>
  );
}
