import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import moment from "moment";
import {capitalize} from "lodash";
// not like to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init
i18next
// load translation using xhr -> see /public/locales
// learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: process.env.REACT_APP_DEBUG,

    // keySeparator: true, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default

      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'caption') return capitalize(value);
        if(value instanceof Date) return moment(value).format(format);
        return value;
      }
    }
  });

i18next.on('languageChanged', function(lng) {
  moment.locale(lng);
});

export default i18next;
