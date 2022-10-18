import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import { FormControl, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { isItemAllowed, useI18n, useWidgetConfig } from '../../providers';
import { useSettings, useSettingsStore } from '../../stores';

export const LanguageSelect: React.FC = () => {
  const { t } = useTranslation();
  const { languages, disableI18n } = useWidgetConfig();
  const { changeLanguage, languageResources } = useI18n();
  const setValue = useSettingsStore((state) => state.setValue);
  const { language } = useSettings(['language']);

  if (disableI18n) {
    return null;
  }

  const handleChangeLanguage = (event: SelectChangeEvent<unknown>) => {
    const language = event.target.value as string;
    setValue('language', language);
    changeLanguage(language);
  };

  const filteredLanguages = Object.keys(languageResources).filter((lng) =>
    isItemAllowed(lng, languages),
  );

  if (filteredLanguages.length <= 1) {
    return null;
  }

  const value = filteredLanguages.includes(language || 'en')
    ? language || 'en'
    : languages?.default || languages?.allow?.[0];

  return (
    <Card mb={2}>
      <CardTitle>{t(`language.title`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          MenuProps={{ elevation: 2 }}
          value={value}
          onChange={handleChangeLanguage}
          IconComponent={KeyboardArrowDownIcon}
          dense
        >
          {filteredLanguages.map((lng) => {
            return (
              <MenuItem key={lng} value={lng}>
                {t('language.name', { lng })}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Card>
  );
};
