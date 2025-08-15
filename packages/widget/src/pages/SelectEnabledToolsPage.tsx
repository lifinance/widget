import type { ToolsResponse } from '@lifi/sdk'
import {
  Avatar,
  Checkbox,
  debounce,
  ListItemAvatar,
  Tooltip,
} from '@mui/material'
import type { ChangeEvent } from 'react'
import {
  type FormEventHandler,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
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
  onClick: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void
  anyCheckboxesSelected: boolean
  noCheckboxesAvailable: boolean
}

const SelectAllCheckbox = memo<SelectAllCheckboxProps>(
  ({
    allCheckboxesSelected,
    anyCheckboxesSelected,
    noCheckboxesAvailable,
    onClick,
  }) => {
    const { t } = useTranslation()
    const tooltipTitle = noCheckboxesAvailable
      ? undefined
      : allCheckboxesSelected
        ? t('tooltip.deselectAll')
        : t('tooltip.selectAll')

    return (
      <Tooltip title={tooltipTitle}>
        <Checkbox
          id="select-all"
          checked={allCheckboxesSelected}
          indeterminate={anyCheckboxesSelected && !allCheckboxesSelected}
          onChange={onClick}
          disabled={noCheckboxesAvailable}
          sx={{ mr: -0.5 }}
        />
      </Tooltip>
    )
  }
)

type ToolCollectionTypes = ToolsResponse['exchanges'] | ToolsResponse['bridges']

export const SelectEnabledToolsPage: React.FC<{
  type: 'Bridges' | 'Exchanges'
}> = ({ type }) => {
  const typeKey = type.toLowerCase() as 'bridges' | 'exchanges'
  const { tools } = useTools()
  const { setToolValue, toggleToolKeys } = useSettingsActions()
  const [enabledTools, disabledTools] = useSettingsStore((state) => [
    state[`_enabled${type}`],
    state[`disabled${type}`],
  ])

  const { t } = useTranslation()
  const elementId = useDefaultElementId()
  const scrollableContainer = useScrollableContainer(elementId)
  const [filteredTools, setFilteredTools] = useState<ToolCollectionTypes>(
    tools?.[typeKey] ?? []
  )

  const handleSelectAll = useCallback(() => {
    toggleToolKeys(
      type,
      filteredTools.map((tool) => tool.key)
    )
  }, [toggleToolKeys, type, filteredTools])

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
        onClick={handleSelectAll}
      />
    ),
    [disabledTools, handleSelectAll, filteredTools]
  )

  useHeader(t(`settings.enabled${type}`), headerAction)

  const handleClick = useCallback(
    (key: string) => {
      setToolValue(type, key, !enabledTools[key])
    },
    [setToolValue, type, enabledTools]
  )

  const handleSearchInputChange: FormEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
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
      },
      [tools, typeKey, scrollableContainer]
    )

  const debouncedSearchInputChange = debounce(handleSearchInputChange, 250)

  return (
    <FullPageContainer disableGutters>
      <StickySearchInput
        onChange={debouncedSearchInputChange}
        placeholder={t(`main.search${type}`)}
      />
      {filteredTools.length ? (
        <SearchList className="long-list" data-testid={`${typeKey}-list`}>
          {filteredTools.map((tool) => (
            <SettingsListItemButton
              key={tool.key}
              onClick={() => handleClick(tool.key)}
            >
              <ListItemAvatar>
                <Avatar src={tool.logoURI} alt={tool.name}>
                  {tool.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={tool.name} />
              <Checkbox
                id={`${typeKey}-${tool.key}-checkbox`}
                checked={enabledTools[tool.key]}
                onChange={() => handleClick(tool.key)}
                onClick={(e) => e.stopPropagation()}
              />
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
