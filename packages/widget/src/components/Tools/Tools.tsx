import type { ToolsResponse } from '@lifi/sdk'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsActions } from '../../stores/settings/useSettingsActions'
import { useSettingsStore } from '../../stores/settings/useSettingsStore'
import { SearchList } from '../Search/SearchInput.style'
import { SearchNotFound } from '../Search/SearchNotFound'
import { ToolItem } from './ToolItem'

export type ToolCollectionTypes =
  | ToolsResponse['exchanges']
  | ToolsResponse['bridges']

interface ToolsProps {
  filteredTools: ToolCollectionTypes
  type: 'Bridges' | 'Exchanges'
}

export const Tools = ({ filteredTools, type }: ToolsProps) => {
  const { t } = useTranslation()
  const typeKey = type.toLowerCase() as 'bridges' | 'exchanges'
  const enabledTools = useSettingsStore((state) => state[`_enabled${type}`])
  const { setToolValue } = useSettingsActions()

  // Use ref to access current enabledTools without causing re-renders
  const enabledToolsRef = useRef(enabledTools)
  enabledToolsRef.current = enabledTools
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

  if (!filteredTools.length) {
    return (
      <SearchNotFound
        message={t(`info.message.empty${type}List`)}
        adjustForStickySearchInput
      />
    )
  }

  return (
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
  )
}
