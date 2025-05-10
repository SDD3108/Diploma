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
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// console.log('Current language:', i18n.language)
// C:\Users\User\Desktop\STEP\Deplome\front-end\i18n.ts
// C:\Users\User\Desktop\STEP\Deplome\front-end\locales\kz\common.json
// C:\Users\User\Desktop\STEP\Deplome\front-end\locales\ru\common.json
// C:\Users\User\Desktop\STEP\Deplome\front-end\locales\eng\common.json
// C:\Users\User\Desktop\STEP\Deplome\front-end\src\pageBuilders\ProfileBuilders\ProfilePageBuilder\ProfilePageBuilder.jsx
// if (typeof window !== 'undefined') {
//   i18n
//   .use(HttpBackend) // Загружает переводы с сервера или локальных файлов
//   .use(LanguageDetector) // Определяет язык пользователя
//   .use(initReactI18next) // Интеграция с React
//   .init({
//     fallbackLng: 'eng', // Язык по умолчанию
//     debug: true, // Включить логирование в консоли
//     interpolation: {
//       escapeValue: false, // React уже экранирует значения
//     },
//     backend: {
//       loadPath: '/locales/{{lng}}/{{ns}}.json', // Путь к файлам переводов
//     },
//   });
// }
// import test from './locales'
i18n
  .use(HttpBackend) // Загружает переводы с сервера или локальных файлов
  .use(LanguageDetector) // Определяет язык пользователя
  .use(initReactI18next) // Интеграция с React
  .init({
    supportedLngs: ['ru', 'kz', 'en'],
    fallbackLng: 'ru',
    lng: 'ru',
    ns: ['common'],
    defaultNS: 'common',
    debug: true,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
})

export default i18n