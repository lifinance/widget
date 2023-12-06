import CheckIcon from '@mui/icons-material/Check';
import { Container, List } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ListItemText } from '../../components/ListItemText';
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
    <Container disableGutters>
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
            {selectedLanguageCode === language && <CheckIcon color="primary" />}
          </SettingsListItemButton>
        ))}
      </List>
    </Container>
  );
};
