// @ts-check

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt', 'pl', 'sv', 'da'],
    localeDetection: true
  },
  defaultNS: 'common',
  localePath: './public/locales',
  detection: {
    // Order of language detection
    order: ['navigator', 'querystring', 'cookie', 'localStorage', 'path', 'subdomain'],
    // Cache user language preference
    caches: ['cookie', 'localStorage'],
    // Cookie settings
    cookieSecure: process.env.NODE_ENV === 'production',
    cookieSameSite: 'strict',
    // Look for similar languages if exact match not found
    lookupFromSubdomainIndex: 0,
    // Automatically handle similar language variations
    supportedLngs: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt', 'pl', 'sv', 'da'],
    fallbackLng: {
      'default': ['en'],
      'de-*': ['de'],
      'fr-*': ['fr'],
      'es-*': ['es'],
      'it-*': ['it'],
      'nl-*': ['nl'],
      'pt-*': ['pt'],
      'pl-*': ['pl'],
      'sv-*': ['sv'],
      'da-*': ['da']
    }
  }
}
