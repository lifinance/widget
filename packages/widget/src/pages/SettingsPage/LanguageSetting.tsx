import { default as LanguageIcon } from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguages } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { HiddenUI } from '../../types';
import { navigationRoutes } from '../../utils';
import { SettingCardButton, SummaryValue } from './SettingsCard';

export const LanguageSetting: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hiddenUI } = useWidgetConfig();
  const { selectedLanguageDisplayName } = useLanguages();

  if (hiddenUI?.includes(HiddenUI.Language)) {
    return null;
  }

  const handleClick = () => {
    navigate(navigationRoutes.languages);
  };

  return (
    <SettingCardButton
      onClick={handleClick}
      icon={<LanguageIcon />}
      title={t(`language.title`)}
    >
      <SummaryValue>{selectedLanguageDisplayName}</SummaryValue>
    </SettingCardButton>
  );
};
