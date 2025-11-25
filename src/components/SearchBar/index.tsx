import { Container } from '../Container';
import styles from './styles.module.css';

interface SearchBarProps {
  onSearchChange: (searchName: string) => void;
  searchName: string;
  placeholder: string;
}

export function SearchBar({
  searchName,
  onSearchChange,
  placeholder,
}: SearchBarProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };
  return (
    <Container>
      <input
        className={styles.input}
        type='text'
        placeholder={placeholder}
        value={searchName}
        onChange={handleChange}
      ></input>
    </Container>
  );
}
