import { useTranslation } from 'react-i18next'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useSplitSubvariantStore } from '../../stores/settings/useSplitSubvariantStore.js'
import {
  NavigationButton,
  NavigationContainer,
} from './NavigationButtons.style'

export const NavigationButtons = () => {
  const { t } = useTranslation()
  const [state, setState] = useSplitSubvariantStore((state) => [
    state.state,
    state.setState,
  ])

  const { setFieldValue } = useFieldActions()

  const handleClick = (newState: 'swap' | 'bridge') => {
    setFieldValue('fromAmount', '')
    setFieldValue('fromToken', '')
    setFieldValue('toToken', '')
    setState(newState)
  }

  return (
    <NavigationContainer>
      {(['swap', 'bridge'] as const).map((type) => (
        <NavigationButton
          key={type}
          variant={state === type ? 'contained' : 'outlined'}
          onClick={() => handleClick(type)}
          disableRipple
        >
          {t(`header.${type}`)}
        </NavigationButton>
      ))}
    </NavigationContainer>
  )
}
