import { Container } from '../Container';
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
    <Container>
      <input
        className={styles.input}
        type='text'
        placeholder={placeholder}
        value={name}
        onChange={handleChange}
      ></input>
    </Container>
  );
}
