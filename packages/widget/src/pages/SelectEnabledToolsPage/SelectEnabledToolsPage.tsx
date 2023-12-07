import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import {
  Avatar,
  Container,
  IconButton,
  List,
  ListItemAvatar,
  Tooltip,
} from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { ListItemText } from '../../components/ListItemText';
import { SettingsListItemButton } from '../../components/SettingsListItemButton';
import { useTools } from '../../hooks';
import { useHeaderStoreContext, useSettingsStore } from '../../stores';

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
          <CheckBoxOutlinedIcon />
        ) : anyCheckboxesSelected ? (
          <IndeterminateCheckBoxOutlinedIcon />
        ) : (
          <CheckBoxOutlineBlankOutlinedIcon />
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
  const [enabledTools, setTools] = useSettingsStore(
    (state) => [state[`enabled${type}`], state.setTools],
    shallow,
  );
  const headerStoreContext = useHeaderStoreContext();

  const handleClick = (key: string) => {
    if (!tools) {
      return;
    }
    const toolKeys = tools[typeKey].map((tool) => tool.key);
    if (enabledTools?.includes(key)) {
      setTools(
        type,
        enabledTools.filter((toolKey) => toolKey !== key),
        toolKeys,
      );
    } else {
      setTools(type, [...enabledTools, key], toolKeys);
    }
  };

  useEffect(() => {
    const allToolsSelected = tools?.[typeKey].length === enabledTools.length;
    const toggleCheckboxes = () => {
      if (!tools) {
        return;
      }
      const toolKeys = tools[typeKey].map((tool) => tool.key);
      if (allToolsSelected) {
        setTools(type, [], toolKeys);
      } else {
        setTools(type, toolKeys, toolKeys);
      }
    };

    return headerStoreContext
      .getState()
      .setAction(
        <SelectAllCheckbox
          allCheckboxesSelected={allToolsSelected}
          anyCheckboxesSelected={!!enabledTools.length}
          onClick={toggleCheckboxes}
        />,
      );
  }, [enabledTools.length, headerStoreContext, setTools, tools, type, typeKey]);

  return (
    <Container disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
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
            {enabledTools?.includes(tool.key) && <CheckIcon color="primary" />}
          </SettingsListItemButton>
        ))}
      </List>
    </Container>
  );
};
