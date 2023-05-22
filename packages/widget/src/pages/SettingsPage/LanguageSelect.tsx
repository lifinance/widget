import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { SelectChangeEvent } from '@mui/material';
import { FormControl, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useWidgetConfig } from '../../providers';
import { useSettings, useSettingsStore } from '../../stores';
import { HiddenUI } from '../../types';

export const LanguageSelect: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { languages, hiddenUI } = useWidgetConfig();
  const setValue = useSettingsStore((state) => state.setValue);
  const { language } = useSettings(['language']);

  if (hiddenUI?.includes(HiddenUI.Language)) {
    return null;
  }

  const handleChangeLanguage = (event: SelectChangeEvent<unknown>) => {
    const language = event.target.value as string;
    setValue('language', language);
    i18n.changeLanguage(language);
  };

  const filteredLanguages = Object.keys(i18n.store.data).sort();

  if (filteredLanguages.length <= 1) {
    return null;
  }

  const value = filteredLanguages.includes(
    language || i18n.resolvedLanguage || '',
  )
    ? language || i18n.resolvedLanguage
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
