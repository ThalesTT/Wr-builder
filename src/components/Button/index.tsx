import { useEffect, useState } from 'react';
import styles from './styles.module.css';

type themes = 'dark' | 'light';

export function Button() {
  const [theme, setTheme] = useState<themes>(() => {
    const savedTheme = (localStorage.getItem('theme') as themes) || 'dark';
    return savedTheme;
  });

  function handleThemeChange() {
    setTheme(prevTheme => {
      const nextTheme: themes = prevTheme === 'dark' ? 'light' : 'dark';
      return nextTheme;
    });
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button onClick={handleThemeChange} className={styles.button}>
      Mudar tema
    </button>
  );
}
