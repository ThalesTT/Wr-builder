import { useOutletContext } from 'react-router-dom';
import type { AppContextType } from '../../MainRouter/Router';

export function useAppData() {
  return useOutletContext<AppContextType>();
}
