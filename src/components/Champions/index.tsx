import styles from './styles.module.css';
import cd from '../../assets/images/cd.png';
import { Frame } from '../Frame';
import { Container } from '../Container';
// TODO lista de champs e itens conforme role e tipo, verificar JSON

// type ChampionsProps = {
//   role: 'Top' | 'Mid' | 'jgl' | 'Adc' | 'Sup';
// };

export function Champions() {
  return (
    <Container>
      <ul className={styles.ul}>
        <li>
          <Frame name='Cosmic Drive' picture={cd} />
        </li>
      </ul>
      <ul>
        <li>
          <Frame name='Cosmic Drive' picture={cd} />
        </li>
      </ul>
      <ul>
        <li>
          <Frame name='Cosmic Drive' picture={cd} />
        </li>
      </ul>
      <ul>
        <li>
          <Frame name='Cosmic Drive' picture={cd} />
        </li>
      </ul>
      <ul>
        <li>
          <Frame name='Cosmic Drive' picture={cd} />
        </li>
      </ul>
      <ul>
        <li>
          <Frame name='Cosmic Drive' picture={cd} />
        </li>
      </ul>
      <ul>
        <li>
          <Frame name='Cosmic Drive' picture={cd} />
        </li>
      </ul>
    </Container>
  );
}
