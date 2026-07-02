import { createContext, useContext, useState, useCallback } from 'react';
import en from '../translations/en.json';
import bn from '../translations/bn.json';

const translations = { en, bn };
const LangCtx = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('pes_lang') || 'en');

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'bn' : 'en';
      localStorage.setItem('pes_lang', next);
      return next;
    });
  }, []);

  // t('nav.home') handles nested dot-keys
  const t = useCallback((key, fallback = '') => {
    const parts = key.split('.');
    let val = translations[lang];
    for (const k of parts) {
      if (val == null) return fallback || key;
      val = val[k];
    }
    return val ?? fallback ?? key;
  }, [lang]);

  return (
    <LangCtx.Provider value={{ lang, toggleLang, t, isBn: lang === 'bn' }}>
      {children}
    </LangCtx.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error('useLang must be inside LanguageProvider');
  return ctx;
};
