import styles from './styles.module.css';

// Definição das propriedades que o componente aceita
interface BuildNameProps {
  // Função chamada sempre que o texto muda (passada pelo pai)
  onNameChange: (name: string) => void;
  // O valor atual do texto (estado controlado)
  name: string;
  // Texto que aparece quando o input está vazio
  placeholder: string;
}

export function BuildName({ name, onNameChange, placeholder }: BuildNameProps) {
  /**
   * Manipulador de evento de mudança.
   * Captura o que o usuário digitou e envia para a função onNameChange,
   * que atualizará o estado no componente pai (ex: AllChampions ou Itens).
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(event.target.value);
  };

  return (
    <div className={styles['build-name-container']}>
      <input
        className={styles['build-name']}
        type='text'
        placeholder={placeholder}
        value={name} // Define o valor do input baseado no estado do React
        onChange={handleChange} // Ouve as mudanças de digitação
        maxLength={30} // Limita o nome a 30 caracteres para não quebrar o layout
      />
    </div>
  );
}
