import CandlestickChartOutlined from '@mui/icons-material/CandlestickChartOutlined'
import SwapHorizOutlined from '@mui/icons-material/SwapHorizOutlined'
import { Tooltip } from '@mui/material'
import type { JSX, SyntheticEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useJumperVariantStore } from '../../stores/jumperVariant/useJumperVariantStore.js'
import { getDefaultJumperTabKey } from '../../stores/jumperVariant/utils.js'
import type { JumperTier } from '../../types/widget.js'
import { RailTab, RailTabs } from './ViewTierRail.style.js'

const tierByIndex: JumperTier[] = ['simple', 'advanced']

export function ViewTierRail(): JSX.Element {
  const { t } = useTranslation()
  const [tier, setState] = useJumperVariantStore((state) => [
    state.state?.tier,
    state.setState,
  ])

  const handleChange = (_: SyntheticEvent, newValue: number): void => {
    // Switching tier swaps the tab set, so reset to the tier's default tab.
    const nextTier = tierByIndex[newValue]
    setState({ tier: nextTier, tabKey: getDefaultJumperTabKey(nextTier) })
  }

  return (
    <RailTabs
      orientation="vertical"
      value={tier === 'advanced' ? 1 : 0}
      onChange={handleChange}
      aria-label="View Tier"
    >
      <Tooltip title={t('header.tier.simple')} placement="left" arrow>
        <RailTab
          icon={<SwapHorizOutlined />}
          aria-label={t('header.tier.simple')}
          disableRipple
        />
      </Tooltip>
      <Tooltip title={t('header.tier.advanced')} placement="left" arrow>
        <RailTab
          icon={<CandlestickChartOutlined />}
          aria-label={t('header.tier.advanced')}
          disableRipple
        />
      </Tooltip>
    </RailTabs>
  )
}
