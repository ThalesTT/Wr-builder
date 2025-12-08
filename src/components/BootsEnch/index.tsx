import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Frame } from '../Frame';
import { useFetchData } from '../useFetchData';

interface BootData {
  name: string; // Nome original (geralmente em inglês)
  nome: string; // Nome em português (para localização)
}

// Interface que define a estrutura do arquivo JSON completo.
interface BootsJson {
  enchants: BootData[];
}

export function BootsEnch() {
  const [boots, setBoots] = useState<BootData[]>([]);
  const { data: BootJson } = useFetchData<BootsJson>(
    '/data/boots-enchant.json',
  );

  useEffect(() => {
    if (BootJson) {
      setBoots(BootJson.enchants);
    }
  }, [BootJson]);
  console.log(boots);
  return (
    <ul className={styles.bench}>
      {boots.map(boot => (
        <li key={boot.name}>
          <Frame
            name={boot.nome}
            picture={'/images/botas/vermelha.png'}
            remove={false}
          />
        </li>
      ))}
    </ul>
  );
}
