import { Check } from '@mui/icons-material';
import { List } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ListItemText } from '../../components/ListItemText';
import { PageContainer } from '../../components/PageContainer';
import { SettingsListItemButton } from '../../components/SettingsListItemButton';
import { useLanguages } from '../../hooks';

export const LanguagesPage: React.FC = () => {
  const { selectedLanguageCode, availableLanguages, setLanguageWithCode } =
    useLanguages();

  const { t } = useTranslation();

  if (availableLanguages.length < 1) {
    return null;
  }

  return (
    <PageContainer disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
        }}
      >
        {availableLanguages.map((language) => (
          <SettingsListItemButton
            key={language}
            onClick={() => setLanguageWithCode(language)}
          >
            <ListItemText primary={t('language.name', { lng: language })} />
            {selectedLanguageCode === language && <Check color="primary" />}
          </SettingsListItemButton>
        ))}
      </List>
    </PageContainer>
  );
};
