import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { useSettingsStore } from '../../stores';
import { navigationRoutes } from '../../utils';
import { ListItemButton, ListItemText } from './EnabledToolsButton.style';

export const EnabledToolsButton: React.FC<{
  type: 'Bridges' | 'Exchanges';
}> = ({ type }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [enabledTools, tools] = useSettingsStore((state) => {
    const enabledTools = Object.values(state[`_enabled${type}`] ?? {});
    return [enabledTools.filter(Boolean).length, enabledTools.length];
  }, shallow);

  const handleClick = () => {
    navigate(navigationRoutes[type.toLowerCase() as 'bridges' | 'exchanges']);
  };

  return (
    <ListItemButton onClick={handleClick}>
      <ListItemText primary={t(`settings.enabled${type}`)} />
      <Box display="flex" alignItems="center">
        <ListItemText primary={`${enabledTools}/${tools}`} />
        <ChevronRightIcon />
      </Box>
    </ListItemButton>
  );
};
