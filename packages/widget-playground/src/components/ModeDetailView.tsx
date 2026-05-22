import type { JSX } from 'react'
import { useCallback } from 'react'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import {
  useConfigSubvariant,
  useConfigSubvariantOptions,
} from '../store/widgetConfig/useConfigValues.js'
import { useDefaultConfig } from '../store/widgetConfig/useDefaultConfig.js'
import { docsLinks } from '../utils/docsLinks.js'
import {
  getActiveMode,
  getModeConfig,
  getSplitOption,
  MODE_OPTIONS,
  type ModeOption,
} from '../utils/mode.js'
import { CardSelect } from './CardSelect/CardSelect.js'
import { DetailViewLayout } from './DetailView/DetailViewLayout.js'

interface ModeDetailViewProps {
  onBack: () => void
}

export const ModeDetailView = ({
  onBack,
}: ModeDetailViewProps): JSX.Element => {
  const { subvariant } = useConfigSubvariant()
  const { subvariantOptions } = useConfigSubvariantOptions()
  const { setSubvariant, setSplitOption } = useConfigActions()
  const { defaultConfig } = useDefaultConfig()

  const splitOption = getSplitOption(subvariantOptions)
  const activeMode = getActiveMode(subvariant, splitOption)

  const handleReset = useCallback((): void => {
    setSubvariant(defaultConfig?.subvariant ?? 'default')
    const defaultSplit = defaultConfig?.subvariantOptions?.split
    setSplitOption(typeof defaultSplit === 'string' ? defaultSplit : undefined)
  }, [defaultConfig, setSubvariant, setSplitOption])

  const handleSelect = useCallback(
    (mode: ModeOption): void => {
      const { subvariant: nextSubvariant, splitOption: nextSplitOption } =
        getModeConfig(mode)
      setSubvariant(nextSubvariant)
      setSplitOption(nextSplitOption)
    },
    [setSubvariant, setSplitOption]
  )

  return (
    <DetailViewLayout
      onBack={onBack}
      onReset={handleReset}
      resetLabel="Reset mode"
      title="Mode"
      description="Configure which flows are enabled. Pick a general-purpose or narrow it down."
      docsHref={docsLinks.subvariants}
    >
      {MODE_OPTIONS.map(({ id, title, description }) => (
        <CardSelect
          key={id}
          title={title}
          description={description}
          selected={activeMode === id}
          onClick={() => handleSelect(id)}
        />
      ))}
    </DetailViewLayout>
  )
}
