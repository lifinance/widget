import type { ToolsResponse } from '@lifi/sdk';
import {
  Check,
  CheckBoxOutlineBlankOutlined,
  CheckBoxOutlined,
  IndeterminateCheckBoxOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  debounce,
  IconButton,
  ListItemAvatar,
  Tooltip,
  useTheme,
} from '@mui/material';
import type { MouseEventHandler } from 'react';
import { type FormEventHandler, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { ListItemText } from '../components/ListItemText.js';
import { PageContainer } from '../components/PageContainer.js';
import { StickySearchInput } from '../components/Search/SearchInput.js';
import { SearchList } from '../components/Search/SearchInput.style.js';
import { SearchNotFound } from '../components/Search/SearchNotFound.js';
import { SettingsListItemButton } from '../components/SettingsListItemButton.js';
import { useFullPageInMaxHeightLayout } from '../hooks/useFullPageInMaxHeightLayout.js';
import { useHeader } from '../hooks/useHeader.js';
import { useTools } from '../hooks/useTools.js';
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
  const theme = useTheme();
  const tooltipTitle = allCheckboxesSelected
    ? t('tooltip.deselectAll')
    : t('tooltip.selectAll');

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton
        size="medium"
        edge={theme?.navigation?.edge ? 'end' : false}
        onClick={onClick}
      >
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
        state[`_enabled${type}`],
        state[`disabled${type}`],
        state.setToolValue,
        state.toggleTools,
      ],
      shallow,
    );

  const { t } = useTranslation();

  const headerAction = useMemo(
    () => (
      <SelectAllCheckbox
        allCheckboxesSelected={!disabledTools.length}
        anyCheckboxesSelected={Boolean(disabledTools.length)}
        onClick={() => toggleTools(type)}
      />
    ),
    [disabledTools.length, toggleTools, type],
  );

  useHeader(t(`settings.enabled${type}`), headerAction);

  useFullPageInMaxHeightLayout();

  const handleClick = (key: string) => {
    setToolValue(type, key, !enabledTools[key]);
  };

  type ToolCollectionTypes =
    | ToolsResponse['exchanges']
    | ToolsResponse['bridges'];

  const [filteredTools, setFilteredTools] = useState<ToolCollectionTypes>(
    tools?.[typeKey] ?? [],
  );

  const handleSearchInputChange: FormEventHandler<HTMLInputElement> = (e) => {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      setFilteredTools(tools?.[typeKey] ?? []);
    } else {
      setFilteredTools(
        (tools?.[typeKey]
          ? tools[typeKey].filter((tool) =>
              tool.name.toLowerCase().includes(value.toLowerCase()),
            )
          : []) as ToolCollectionTypes,
      );
    }
  };

  const debouncedSearchInputChange = debounce(handleSearchInputChange, 250);

  return (
    <PageContainer disableGutters>
      <StickySearchInput
        onChange={debouncedSearchInputChange}
        placeholder={t(`main.search${type}`)}
      />
      {filteredTools.length ? (
        <SearchList>
          {filteredTools.map((tool) => (
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
        </SearchList>
      ) : (
        <SearchNotFound
          message={t(`info.message.empty${type}List`)}
          adjustForStickySearchInput
        />
      )}
    </PageContainer>
  );
};
