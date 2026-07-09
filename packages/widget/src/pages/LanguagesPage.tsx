import Check from '@mui/icons-material/Check'
import { Box, List } from '@mui/material'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ListItemText } from '../components/ListItemText.js'
import { PageContainer } from '../components/PageContainer.js'
import { SettingsListItemButton } from '../components/SettingsListItemButton.js'
import { useHeader } from '../hooks/useHeader.js'
import { useLanguages } from '../hooks/useLanguages.js'
import { useListHeight } from '../hooks/useListHeight.js'
import { languageNames } from '../providers/I18nProvider/constants.js'

export const LanguagesPage: React.FC = () => {
  const { t } = useTranslation()
  const listParentRef = useRef<HTMLDivElement>(null)
  const { selectedLanguageCode, availableLanguages, setLanguageWithCode } =
    useLanguages()

  useHeader(t('language.title'))

  const { listHeight } = useListHeight({
    listParentRef,
  })

  if (availableLanguages.length < 1) {
    return null
  }

  return (
    <PageContainer disableGutters>
      <Box
        className="long-list"
        ref={listParentRef}
        style={{ height: listHeight, overflow: 'auto' }}
      >
        <List
          sx={{
            padding: 1.5,
          }}
        >
          {availableLanguages.map((language) => (
            <SettingsListItemButton
              key={language}
              onClick={() => setLanguageWithCode(language)}
            >
              <ListItemText
                primary={
                  languageNames[language as keyof typeof languageNames] ||
                  t('language.name', {
                    lng: language,
                  }) ||
                  language
                }
              />
              {selectedLanguageCode === language && <Check color="primary" />}
            </SettingsListItemButton>
          ))}
        </List>
      </Box>
    </PageContainer>
  )
}
