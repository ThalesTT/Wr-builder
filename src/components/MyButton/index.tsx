import styles from './styles.module.css';

const Category = {
  adc: 'adc',
  attack: 'ataque',
  jungle: 'Jungle',
  mid: 'mid',
  top: 'top',
  sup: 'sup',
  defense: 'defesa',
  magic: 'magico',
  boots: 'botas',
  all: 'all',
  rune: 'rune',
  enchant: 'encantamentos',
  suporte: 'suporte',
};

export type variety = keyof typeof Category;
type MyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variety: variety;
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
        alt={Category[variety]}
        src={`/images/btn-icons/${variety}.WEBP`}
        title={Category[variety]}
        width={30}
        height={30}
      />
    </button>
  );
}
