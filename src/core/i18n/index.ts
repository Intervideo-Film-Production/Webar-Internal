import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import LanguageDetector, { CustomDetector, DetectorOptions } from 'i18next-browser-languagedetector';
import HttpApi, { BackendOptions } from 'i18next-http-backend';
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getSupportLanguages,
  GET_TRANSLATION_QUERY
} from 'src/crud';
import { useQuery } from "react-query";
import { QueryKeys } from "../declarations/enum";
import { ISupportLanguage } from "../declarations/app";
import { Subject } from "rxjs";

const projectId = process.env.REACT_APP_PROJECT_ID as string;
const dataset = process.env.REACT_APP_DATASET as string;

const detectOptions: DetectorOptions = {
  // order and from where user language should be detected
  order: ['customLanguageDetector', 'localStorage', 'sessionStorage', 'navigator'],

  // keys or params to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // cache user language on
  caches: ['localStorage', 'cookie'],
};

const customLanguageDetector: (defaultLanguage?: string) => CustomDetector = (defaultLanguage?: string) => ({
  name: 'customLanguageDetector',
  lookup: (options: DetectorOptions) => {
    const order = options.order;
    let locale: string | null = '';
    (order as string[]).slice(1).forEach(orderKey => {
      if (!!locale) return;
      switch (orderKey) {
        case 'localStorage':
          locale = localStorage.getItem(options.lookupLocalStorage as string);
          break;
        case 'sessionStorage':
          locale = sessionStorage.getItem(options.lookupSessionStorage as string);
          break;
        case 'navigator':
          locale = window.navigator.language;
          break;
      };
    });

    // validate locale 
    let _validLocale = '';
    try {
      const locales = Intl.getCanonicalLocales(locale);
      if (locales.length > 0) {
        _validLocale = locales[0];
      }
    } catch (ex) { }

    // if language is regional and has suffix, replace '-' with '_' to match localized key
    _validLocale = _validLocale.replace('-', '_');

    // if there is no language found return en
    if (!_validLocale) return (defaultLanguage || 'en');
    return _validLocale;
  },
});



/**
 * api version should be fixed to a specific date to prevent error if sanity updates its api
 * https://www.sanity.io/docs/api-versioning#228b7a6a8148
 */
const apiVersion = 'v2021-11-02';

/**
 * endpoint configuration following
 * https://www.sanity.io/docs/http-urls
 */

const i18nOptions = (brandId: string) => {
  const loadLanguageUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=${GET_TRANSLATION_QUERY}&$language="{{lng}}"`;
  // TODO locales from static folder should be redistributed
  const loadLocalDataUrl = `./sourceData/locales/${brandId}/{{lng}}/{{ns}}.json`;
  const useLocalData = process.env.REACT_APP_STATIC_DATA;

  const i18nBackendOptions: BackendOptions = {
    loadPath: useLocalData !== 'TRUE' ? loadLanguageUrl : loadLocalDataUrl,
    /**
     * add missing translation key is not implementable with Team plan due to custom access control restriction
     * write permission is enabled only by Enterprise
     * https://www.sanity.io/docs/access-control
     * make sure the translation data is complete to prevent i18n sending request to add Path
     */
    // addPath: addLanguageUrl,
    requestOptions: {
      mode: 'cors',
      cache: 'default'
    },
    parse: (response) => {

      let translation = null;
      if (useLocalData !== 'TRUE') {
        // TODO local language
        try {
          const _response = JSON.parse(response);
          const result = _response.result as { brandId: string, translation: string }[];
          const brandTranslation = result.find(t => t.brandId === brandId);
          if (!!brandTranslation) {
            translation = JSON.parse(brandTranslation.translation);
          }

        } catch (ex) { }
      } else {
        translation = JSON.parse(response);
      }

      return translation;

    }
  };

  return i18nBackendOptions;
}

const loadLanguageI18n = (brandId: string, supportLanguage?: ISupportLanguage[]) => new Promise((resolve: (value: string) => void, reject: (err: string) => void) => {
  const i18nBackendOptions = i18nOptions(brandId);
  const languageDetector = new LanguageDetector();

  const defaultLanguage = supportLanguage?.find(l => l.isDefault);
  languageDetector.addDetector(customLanguageDetector(defaultLanguage?.code));

  i18n
    .use(languageDetector)
    .use(HttpApi)
    .use(initReactI18next)
    .init({
      detection: detectOptions,
      // debug: true,
      backend: i18nBackendOptions,
      fallbackLng: 'en',
      keySeparator: '>',
      saveMissing: false,
      nsSeparator: '|',
      // preload: ['en'],
      ns: ['default'],
      defaultNS: 'default',
    }).then(() => {
      resolve(i18n.language);
    }).catch(err => {
      reject(err);
    });
});


export const useLanguage = () => {
  const [languageLoaded, setLanguageLoaded] = useState('');
  const { isFetched: supportedLanguagesFetched, data: supportedLanguages } = useQuery(QueryKeys.language, () => getSupportLanguages());
  const ref = useRef<Subject<any>>(new Subject());


  const loadLanguage = useCallback((brandId: string) => {
    if (supportedLanguages) {
      loadLanguageI18n(brandId, supportedLanguages);

      i18n.on('loaded', function () {
        // if loaded language is not ready => fallback to en
        const hasLng = i18n.hasResourceBundle(i18n.language, 'default');
        if (!hasLng) {
          const defaultLanguage = supportedLanguages.find(l => l.isDefault);
          if (!!defaultLanguage) {
            i18n.changeLanguage(defaultLanguage.code);
            ref.current.next(defaultLanguage.code);
          }
        } else {
          ref.current.next(i18n.language);

        }
      });



    }
  }, [supportedLanguages]);

  useEffect(() => {
    if (!!ref.current) {
      const subscription = ref.current.subscribe(lng => {
        setLanguageLoaded(lng);
      });

      return () => { subscription.unsubscribe(); }
    }
  })

  return { supportedLanguagesFetched, languageLoaded, loadLanguage };
}
