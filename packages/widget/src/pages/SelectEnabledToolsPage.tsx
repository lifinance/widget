import type { ToolsResponse } from '@lifi/sdk'
import Check from '@mui/icons-material/Check'
import CheckBoxOutlineBlankOutlined from '@mui/icons-material/CheckBoxOutlineBlankOutlined'
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined'
import IndeterminateCheckBoxOutlined from '@mui/icons-material/IndeterminateCheckBoxOutlined'
import {
  Avatar,
  IconButton,
  ListItemAvatar,
  Tooltip,
  debounce,
  useTheme,
} from '@mui/material'
import type { MouseEventHandler } from 'react'
import { type FormEventHandler, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'
import { FullPageContainer } from '../components/FullPageContainer.js'
import { ListItemText } from '../components/ListItemText.js'
import { StickySearchInput } from '../components/Search/SearchInput.js'
import { SearchList } from '../components/Search/SearchInput.style.js'
import { SearchNotFound } from '../components/Search/SearchNotFound.js'
import { SettingsListItemButton } from '../components/SettingsListItemButton.js'
import { useDefaultElementId } from '../hooks/useDefaultElementId.js'
import { useHeader } from '../hooks/useHeader.js'
import { useScrollableContainer } from '../hooks/useScrollableContainer.js'
import { useTools } from '../hooks/useTools.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'
import { useSettingsStore } from '../stores/settings/useSettingsStore.js'

interface SelectAllCheckboxProps {
  allCheckboxesSelected: boolean
  onClick: MouseEventHandler
  anyCheckboxesSelected: boolean
  noCheckboxesAvailable: boolean
}

const SelectAllCheckbox: React.FC<SelectAllCheckboxProps> = ({
  allCheckboxesSelected,
  anyCheckboxesSelected,
  noCheckboxesAvailable,
  onClick,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const tooltipTitle = noCheckboxesAvailable
    ? undefined
    : allCheckboxesSelected
      ? t('tooltip.deselectAll')
      : t('tooltip.selectAll')

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
  )
}

type ToolCollectionTypes = ToolsResponse['exchanges'] | ToolsResponse['bridges']

export const SelectEnabledToolsPage: React.FC<{
  type: 'Bridges' | 'Exchanges'
}> = ({ type }) => {
  const typeKey = type.toLowerCase() as 'bridges' | 'exchanges'
  const { tools } = useTools()
  const { setToolValue, toggleToolKeys } = useSettingsActions()
  const [enabledTools, disabledTools] = useSettingsStore(
    (state) => [state[`_enabled${type}`], state[`disabled${type}`]],
    shallow
  )

  const { t } = useTranslation()
  const elementId = useDefaultElementId()
  const scrollableContainer = useScrollableContainer(elementId)
  const [filteredTools, setFilteredTools] = useState<ToolCollectionTypes>(
    tools?.[typeKey] ?? []
  )

  const headerAction = useMemo(
    () => (
      <SelectAllCheckbox
        allCheckboxesSelected={
          !!filteredTools.length &&
          filteredTools.every((tool) => !disabledTools.includes(tool.key))
        }
        anyCheckboxesSelected={
          !!filteredTools.length &&
          filteredTools.some((tool) => disabledTools.includes(tool.key))
        }
        noCheckboxesAvailable={!filteredTools.length}
        onClick={() =>
          toggleToolKeys(
            type,
            filteredTools.map((tool) => tool.key)
          )
        }
      />
    ),
    [disabledTools, toggleToolKeys, type, filteredTools]
  )

  useHeader(t(`settings.enabled${type}`), headerAction)

  const handleClick = (key: string) => {
    setToolValue(type, key, !enabledTools[key])
  }

  const handleSearchInputChange: FormEventHandler<HTMLInputElement> = (e) => {
    const value = (e.target as HTMLInputElement).value

    if (!value) {
      setFilteredTools(tools?.[typeKey] ?? [])
    } else {
      setFilteredTools(
        (tools?.[typeKey]
          ? tools[typeKey].filter((tool) =>
              tool.name.toLowerCase().includes(value.toLowerCase())
            )
          : []) as ToolCollectionTypes
      )
    }

    if (scrollableContainer) {
      scrollableContainer.scrollTop = 0
    }
  }

  const debouncedSearchInputChange = debounce(handleSearchInputChange, 250)

  return (
    <FullPageContainer disableGutters>
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
    </FullPageContainer>
  )
}
