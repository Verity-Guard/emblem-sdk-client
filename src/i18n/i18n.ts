import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translations';
import translationDE from './locales/de/translations';
import translationFR from './locales/fr/translations';
import translationES from './locales/es/translations';

const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
  fr: {
    translation: translationFR,
  },
  es: {
    translation: translationES,
  },
};

const supportedLanguages = Object.keys(resources);

let language = 'en';

// Check if running on the client side
if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
  const browserLang = navigator.language?.substring(0, 2);
  language = supportedLanguages.includes(browserLang) ? browserLang : 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: language, // default language
    fallbackLng: 'en', // when specified language translations are not available

    interpolation: {
      escapeValue: false, // react already handles xss
    },
  });


export default i18n;
