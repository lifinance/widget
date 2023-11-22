import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { useWidgetConfig } from '../../providers';
import { HiddenUI } from '../../types';
import { navigationRoutes } from '../../utils';
import { useLanguages } from '../../hooks';
import { SettingCardButton, SettingSummaryText } from './SettingsCard';

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
      <SettingSummaryText>{selectedLanguageDisplayName}</SettingSummaryText>
    </SettingCardButton>
  );
};
