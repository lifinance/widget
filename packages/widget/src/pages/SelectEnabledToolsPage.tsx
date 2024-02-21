import {
  Check,
  CheckBoxOutlineBlankOutlined,
  CheckBoxOutlined,
  IndeterminateCheckBoxOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  IconButton,
  List,
  ListItemAvatar,
  Tooltip,
} from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { ListItemText } from '../components/ListItemText.js';
import { PageContainer } from '../components/PageContainer.js';
import { SettingsListItemButton } from '../components/SettingsListItemButton.js';
import { useTools } from '../hooks/useTools.js';
import { useHeaderStoreContext } from '../stores/header/useHeaderStore.js';
import { useSettingsStore } from '../stores/settings/useSettingsStore.js';

interface SelectAllCheckboxProps {
  allCheckboxesSelected: boolean;
  onClick: MouseEventHandler;
  anyCheckboxesSelected: boolean;
}

const SelectAllCheckbox: React.FC<SelectAllCheckboxProps> = ({
  allCheckboxesSelected,
  anyCheckboxesSelected,
  onClick,
}) => {
  const { t } = useTranslation();
  const tooltipTitle = allCheckboxesSelected
    ? t('tooltip.deselectAll')
    : t('tooltip.selectAll');

  return (
    <Tooltip title={tooltipTitle} arrow>
      <IconButton size="medium" edge="end" onClick={onClick}>
        {allCheckboxesSelected ? (
          <CheckBoxOutlined />
        ) : anyCheckboxesSelected ? (
          <IndeterminateCheckBoxOutlined />
        ) : (
          <CheckBoxOutlineBlankOutlined />
        )}
      </IconButton>
    </Tooltip>
  );
};

export const SelectEnabledToolsPage: React.FC<{
  type: 'Bridges' | 'Exchanges';
}> = ({ type }) => {
  const typeKey = type.toLowerCase() as 'bridges' | 'exchanges';
  const { tools } = useTools();
  const [enabledTools, disabledTools, setToolValue, toggleTools] =
    useSettingsStore(
      (state) => [
        state[`enabled${type}`],
        state[`disabled${type}`],
        state.setToolValue,
        state.toggleTools,
      ],
      shallow,
    );
  const headerStoreContext = useHeaderStoreContext();

  const handleClick = (key: string) => {
    setToolValue(type, key, !enabledTools[key]);
  };

  useEffect(() => {
    return headerStoreContext
      .getState()
      .setAction(
        <SelectAllCheckbox
          allCheckboxesSelected={!disabledTools.length}
          anyCheckboxesSelected={Boolean(disabledTools.length)}
          onClick={() => toggleTools(type)}
        />,
      );
  }, [disabledTools.length, headerStoreContext, toggleTools, type]);

  return (
    <PageContainer disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
        }}
      >
        {tools?.[typeKey].map((tool) => (
          <SettingsListItemButton
            key={tool.name}
            onClick={() => handleClick(tool.key)}
          >
            <ListItemAvatar>
              <Avatar src={tool.logoURI} alt={tool.name}>
                {tool.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={tool.name} />
            {enabledTools[tool.key] && <Check color="primary" />}
          </SettingsListItemButton>
        ))}
      </List>
    </PageContainer>
  );
};
