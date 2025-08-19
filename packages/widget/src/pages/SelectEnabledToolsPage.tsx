import { Checkbox, debounce, Tooltip } from '@mui/material'
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
import { StickySearchInput } from '../components/Search/SearchInput.js'
import { type ToolCollectionTypes, Tools } from '../components/Tools/Tools.js'
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
          sx={{ mr: -1.5 }}
        />
      </Tooltip>
    )
  }
)

export const SelectEnabledToolsPage: React.FC<{
  type: 'Bridges' | 'Exchanges'
}> = ({ type }) => {
  const typeKey = type.toLowerCase() as 'bridges' | 'exchanges'
  const { tools } = useTools()
  const { toggleToolKeys } = useSettingsActions()

  const disabledTools = useSettingsStore((state) => state[`disabled${type}`])

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
      <Tools filteredTools={filteredTools} type={type} />
    </FullPageContainer>
  )
}
