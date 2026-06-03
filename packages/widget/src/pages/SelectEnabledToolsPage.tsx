import { Box, Checkbox, debounce, Tooltip } from '@mui/material'
import type { ChangeEvent, ChangeEventHandler } from 'react'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../components/PageContainer.js'
import { SearchInput } from '../components/Search/SearchInput.js'
import { type ToolCollectionTypes, Tools } from '../components/Tools/Tools.js'
import { useHeader } from '../hooks/useHeader.js'
import { useListHeight } from '../hooks/useListHeight.js'
import { useTools } from '../hooks/useTools.js'
import { useSettingsStore } from '../stores/settings/SettingsStore.js'
import { useSettingsActions } from '../stores/settings/useSettingsActions.js'

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
          sx={{ mr: -1.5, height: 20 }}
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
  const headerRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = useState('')

  const { listHeight } = useListHeight({
    listParentRef: listRef,
    headerRef,
  })

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

  const handleSearchInputChange: ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setSearchValue(e.target.value)
      listRef.current?.scrollTo(0, 0)
    }, [])

  const debouncedSearchInputChange = debounce(handleSearchInputChange, 250)

  return (
    <PageContainer disableGutters>
      <Box ref={headerRef} sx={{ px: 3, pb: 2, pt: 1.5 }}>
        <SearchInput
          onChange={debouncedSearchInputChange}
          placeholder={t(`main.search${type}`)}
          autoFocus
        />
      </Box>
      <Box ref={listRef} style={{ height: listHeight, overflow: 'auto' }}>
        <Tools filteredTools={filteredTools} type={type} />
      </Box>
    </PageContainer>
  )
}
