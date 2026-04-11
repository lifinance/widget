import en from '@lifi/widget/src/i18n/en.json'
import { compactNumberFormatter } from '@lifi/widget/src/utils/compactNumberFormatter'
import { currencyExtendedFormatter } from '@lifi/widget/src/utils/currencyExtendedFormatter'
import { percentFormatter } from '@lifi/widget/src/utils/percentFormatter'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: { en: { translation: en } },
  returnEmptyString: false,
})

i18n.services.formatter?.addCached('numberExt', compactNumberFormatter)
i18n.services.formatter?.addCached('currencyExt', currencyExtendedFormatter)
i18n.services.formatter?.addCached('percent', percentFormatter)

export { i18n }
