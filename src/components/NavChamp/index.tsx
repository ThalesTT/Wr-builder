import { MyButton } from '../MyButton';
import adc from '../../assets/images/lanes/adc.png';
import { NavButtons } from '../NavButtons';

export function NavChamp() {
  return (
    <NavButtons>
      <MyButton variety='top' />
      <MyButton variety='jungle' />
      <MyButton variety='mid' />
      <MyButton variety='adc' />
      <MyButton variety='sup' />
    </NavButtons>
  );
}
