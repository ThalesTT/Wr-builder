import styles from './styles.module.css';

interface BuildName {
  onNameChange: (name: string) => void;
  name: string;
  placeholder: string;
}

export function BuildName({ name, onNameChange, placeholder }: BuildName) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(event.target.value);
  };
  return (
    <div className={styles['build-name-container']}>
      <input
        className={styles['build-name']}
        type='text'
        placeholder={placeholder}
        value={name}
        onChange={handleChange}
        maxLength={30}
      ></input>
    </div>
  );
}
