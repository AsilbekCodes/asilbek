import React, { createContext, useContext, useState, useEffect } from 'react';
import uz from '../locales/uz.json';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import tj from '../locales/tj.json';

const TRANSLATIONS = { uz, en, ru, tj };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('site_lang') || 'uz';
  });

  useEffect(() => {
    localStorage.setItem('site_lang', lang);
  }, [lang]);

  const t = (path) => {
    const keys = path.split('.');
    let value = TRANSLATIONS[lang];
    for (const key of keys) {
      value = value?.[key];
    }
    return value || path;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
