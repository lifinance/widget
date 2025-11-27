import Language from '@mui/icons-material/Language'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { CardButton } from '../../components/Card/CardButton'
import { CardValue } from '../../components/Card/CardButton.style'
import { useLanguages } from '../../hooks/useLanguages'
import { languageNames } from '../../providers/I18nProvider/constants'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import { HiddenUI } from '../../types/widget'
import { navigationRoutes } from '../../utils/navigationRoutes'

export const LanguageSetting: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { hiddenUI } = useWidgetConfig()
  const { selectedLanguageCode } = useLanguages()

  if (hiddenUI?.includes(HiddenUI.Language)) {
    return null
  }

  const handleClick = () => {
    navigate({ to: navigationRoutes.languages })
  }

  return (
    <CardButton
      onClick={handleClick}
      icon={<Language />}
      title={t('language.title')}
    >
      <CardValue>
        {languageNames[selectedLanguageCode as keyof typeof languageNames] ||
          t('language.name', {
            lng: selectedLanguageCode,
          }) ||
          selectedLanguageCode}
      </CardValue>
    </CardButton>
  )
}
