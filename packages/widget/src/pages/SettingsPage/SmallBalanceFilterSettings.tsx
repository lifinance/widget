import AttachMoney from '@mui/icons-material/AttachMoney'
import { Box } from '@mui/material'
import {
  type ChangeEvent,
  type ChangeEventHandler,
  type FocusEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '../../components/Switch.js'
import { useSettings } from '../../stores/settings/useSettings.js'
import { useSettingsActions } from '../../stores/settings/useSettingsActions.js'
import { formatInputAmount, usdDecimals } from '../../utils/format.js'
import {
  SettingCardExpandable,
  type SettingCardExpandableRef,
} from './SettingsCard/SettingCardExpandable.js'
import {
  SettingsCustomInput,
  SettingsFieldSet,
} from './SlippageSettings/SlippageSettings.style.js'

const defaultThreshold = '0.01'

export const SmallBalanceFilterSettings: React.FC = () => {
  const { t } = useTranslation()
  const { smallBalanceThreshold } = useSettings(['smallBalanceThreshold'])
  const { setValue } = useSettingsActions()
  const [inputValue, setInputValue] = useState(
    smallBalanceThreshold ?? defaultThreshold
  )
  const buttonRef = useRef<SettingCardExpandableRef>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatAndSetThreshold = (inputValue: string, returnInitial = false) => {
    const value = inputValue.replace('$', '')
    const formattedValue = formatInputAmount(value, usdDecimals, returnInitial)
    if (returnInitial) {
      setInputValue(formattedValue)
    } else {
      const formattedOrDefault = formattedValue || defaultThreshold
      setInputValue(formattedOrDefault)
      setValue('smallBalanceThreshold', formattedOrDefault)
    }
  }

  const handleInputUpdate: ChangeEventHandler<HTMLInputElement> = (event) => {
    formatAndSetThreshold(event.target.value, true)
  }

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    formatAndSetThreshold(event.target.value, false)
  }

  const handleHideSmallBalancesChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setValue(
      'smallBalanceThreshold',
      event.target.checked ? defaultThreshold : undefined
    )
    if (buttonRef.current) {
      buttonRef.current?.toggleExpanded(event.target.checked)
    }
  }

  const handleExpanded = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    setInputValue(smallBalanceThreshold ?? defaultThreshold)
  }, [smallBalanceThreshold])

  return (
    <SettingCardExpandable
      ref={buttonRef}
      value={
        <Switch
          checked={!!smallBalanceThreshold}
          onChange={handleHideSmallBalancesChange}
          aria-label={t('settings.hideSmallBalances')}
        />
      }
      icon={<AttachMoney />}
      title={t('settings.hideSmallBalances')}
      disabled={!smallBalanceThreshold}
      keepValueVisible
      onEntered={handleExpanded}
    >
      <Box
        sx={{
          mt: 1.5,
        }}
      >
        <SettingsFieldSet>
          <SettingsCustomInput
            inputRef={inputRef}
            selected
            inputProps={{
              inputMode: 'decimal',
            }}
            onChange={handleInputUpdate}
            onBlur={handleInputBlur}
            value={`$${inputValue}`}
            autoComplete="off"
          />
        </SettingsFieldSet>
      </Box>
    </SettingCardExpandable>
  )
}
