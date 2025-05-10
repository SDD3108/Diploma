// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

// import ru from '@/src/laug/ru/common.json';
// import kz from '@/src/laug/kz/common.json';
// import eng from '@/src/laug/eng/common.json';

// i18n
//   .use(LanguageDetector) // определяет язык пользователя
//   .use(initReactI18next) // подключает к React
//   .init({
//     fallbackLng: 'ru',
//     resources: {
//       ru: { translation: ru },
//       kz: { translation: kz },
//       eng: { translation: eng },
//     },
//     interpolation: {
//       escapeValue: false, // для React это не нужно
//     },
//   });

// export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

console.log('Current language:', i18n.language)

i18n
  .use(HttpBackend) // Загружает переводы с сервера или локальных файлов
  .use(LanguageDetector) // Определяет язык пользователя
  .use(initReactI18next) // Интеграция с React
  .init({
    fallbackLng: 'ru', // Язык по умолчанию
    debug: true, // Включить логирование в консоли
    interpolation: {
      escapeValue: false, // React уже экранирует значения
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Путь к файлам переводов
    },
  });

export default i18n;