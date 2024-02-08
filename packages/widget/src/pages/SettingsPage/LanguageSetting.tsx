import { Language } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CardButton, CardValue } from '../../components/Card';
import { useLanguages } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { HiddenUI } from '../../types';
import { navigationRoutes } from '../../utils';

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
