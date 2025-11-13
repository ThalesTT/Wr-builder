import { MyButton } from '../MyButton';
import adc from '../../assets/images/lanes/adc.png';
import { NavButtons } from '../NavButtons';

export function NavChamp() {
  return (
    <NavButtons>
      <MyButton lane='Top' laneImage={adc}></MyButton>
      <MyButton lane='Top' laneImage='ccc'></MyButton>
      <MyButton lane='Top' laneImage='ccc'></MyButton>
      <MyButton lane='Top' laneImage='ccc'></MyButton>
      <MyButton lane='Top' laneImage='ccc'></MyButton>
      <MyButton lane='Top' laneImage='ccc'></MyButton>
    </NavButtons>
  );
}
