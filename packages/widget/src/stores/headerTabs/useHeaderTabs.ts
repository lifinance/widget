import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { WidgetMode } from '../../types/widget.js'
import type { HeaderTab } from './types.js'

export const useHeaderTabs = (mode?: WidgetMode): HeaderTab[] => {
  const { t } = useTranslation()

  return useMemo(() => {
    switch (mode) {
      case 'split':
        return [
          {
            label: t('header.swap'),
            mode: 'split',
            modeOptions: { split: 'swap' },
          },
          {
            label: t('header.bridge'),
            mode: 'split',
            modeOptions: { split: 'bridge' },
          },
        ]
      case 'jumper-simple':
        return [
          {
            label: t('header.swapAndBridge'),
            mode: 'default',
          },
          {
            label: t('header.private'),
            mode: 'split',
            modeOptions: { split: 'swap' },
          },
          { label: t('header.gas'), mode: 'refuel' },
        ]
      case 'jumper-advanced':
        return [
          {
            label: t('header.swap'),
            mode: 'split',
            modeOptions: { split: 'swap' },
          },
          {
            label: t('header.bridge'),
            mode: 'split',
            modeOptions: { split: 'bridge' },
          },
          { label: t('header.limit'), mode: 'default' },
        ]
      default:
        return []
    }
  }, [mode, t])
}
