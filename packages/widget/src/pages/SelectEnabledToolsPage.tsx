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
  useRef,
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

interface ToolItemProps {
  tool: any
  typeKey: string
  isEnabled: boolean
  onToggle: (key: string) => void
}

const ToolItem = memo<ToolItemProps>(
  ({ tool, typeKey, isEnabled, onToggle }) => {
    const handleClick = useCallback(() => {
      onToggle(tool.key)
    }, [onToggle, tool.key])

    const handleCheckboxClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        onToggle(tool.key)
      },
      [onToggle, tool.key]
    )

    return (
      <SettingsListItemButton onClick={handleClick}>
        <ListItemAvatar>
          <Avatar src={tool.logoURI} alt={tool.name}>
            {tool.name[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={tool.name} />
        <Checkbox
          id={`${typeKey}-${tool.key}-checkbox`}
          checked={isEnabled}
          onChange={handleClick}
          onClick={handleCheckboxClick}
        />
      </SettingsListItemButton>
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

  // Optimize state access to prevent unnecessary re-renders
  const enabledTools = useSettingsStore((state) => state[`_enabled${type}`])
  const disabledTools = useSettingsStore((state) => state[`disabled${type}`])

  // Use ref to access current enabledTools without causing re-renders
  const enabledToolsRef = useRef(enabledTools)
  enabledToolsRef.current = enabledTools

  const { t } = useTranslation()
  const elementId = useDefaultElementId()
  const scrollableContainer = useScrollableContainer(elementId)
  const [searchValue, setSearchValue] = useState('')
  const filteredTools = useMemo(() => {
    const toolsList = tools?.[typeKey] ?? []

    if (!searchValue) {
      return toolsList
    }

    const lowerSearchValue = searchValue.toLowerCase()
    return toolsList.filter((tool) =>
      tool.name.toLowerCase().includes(lowerSearchValue)
    ) as ToolCollectionTypes
  }, [tools, typeKey, searchValue])

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

  // Create stable callbacks that don't depend on enabledTools state
  const toggleCallbacks = useMemo(() => {
    const callbacks: Record<string, () => void> = {}
    filteredTools.forEach((tool) => {
      callbacks[tool.key] = () => {
        // Access current state via ref to avoid dependency on enabledTools
        setToolValue(type, tool.key, !enabledToolsRef.current[tool.key])
      }
    })
    return callbacks
  }, [filteredTools, setToolValue, type])

  const handleSearchInputChange: FormEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        const value = (e.target as HTMLInputElement).value
        setSearchValue(value)

        if (scrollableContainer) {
          scrollableContainer.scrollTop = 0
        }
      },
      [scrollableContainer]
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
            <ToolItem
              key={tool.key}
              tool={tool}
              typeKey={typeKey}
              isEnabled={enabledTools[tool.key]}
              onToggle={toggleCallbacks[tool.key]}
            />
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
