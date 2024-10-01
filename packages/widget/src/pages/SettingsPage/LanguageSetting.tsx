import { Language } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CardButton } from '../../components/Card/CardButton.js';
import { CardValue } from '../../components/Card/CardButton.style.js';
import { useLanguages } from '../../hooks/useLanguages.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { HiddenUI } from '../../types/widget.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';

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
    <CardButton
      onClick={handleClick}
      icon={<Language />}
      title={t(`language.title`)}
    >
      <CardValue>{selectedLanguageDisplayName}</CardValue>
    </CardButton>
  );
};
