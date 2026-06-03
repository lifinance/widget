import type { JSX } from 'react'
import { useCallback } from 'react'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import {
  useConfigMode,
  useConfigModeOptions,
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
  const { mode } = useConfigMode()
  const { modeOptions } = useConfigModeOptions()
  const { setMode, setSplitOption } = useConfigActions()
  const { defaultConfig } = useDefaultConfig()

  const splitOption = getSplitOption(modeOptions)
  const activeMode = getActiveMode(mode, splitOption)

  const handleReset = useCallback((): void => {
    setMode(defaultConfig?.mode ?? 'default')
    const defaultSplit = defaultConfig?.modeOptions?.split
    setSplitOption(typeof defaultSplit === 'string' ? defaultSplit : undefined)
  }, [defaultConfig, setMode, setSplitOption])

  const handleSelect = useCallback(
    (selectedMode: ModeOption): void => {
      const { mode: nextMode, splitOption: nextSplitOption } =
        getModeConfig(selectedMode)
      setMode(nextMode)
      setSplitOption(nextSplitOption)
    },
    [setMode, setSplitOption]
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
