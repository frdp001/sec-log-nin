
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, detectIsChina, Language } from '../i18n';

interface LanguageContextType {
  lang: Language;
  t: typeof translations.en;
  setLang: (l: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    if (detectIsChina()) {
      setLang('zh');
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
