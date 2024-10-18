import { useEditToolsActions } from '../../../../store/editTools/useEditToolsActions'
import { useHeaderAndFooterToolValues } from '../../../../store/editTools/useHeaderAndFooterToolValues'
import { useConfig } from '../../../../store/widgetConfig/useConfig'
import { useConfigActions } from '../../../../store/widgetConfig/useConfigActions'
import { CardRowColumn } from '../../../Card/Card.style'
import { Switch } from '../../../Switch'
import { ControlContainer, ControlRowContainer } from '../DesignControls.style'

export const HeaderAndFooterControls = () => {
  const { showMockHeader, showMockFooter, isFooterFixed } =
    useHeaderAndFooterToolValues()
  const { setHeaderVisibility, setFooterVisibility, setFixedFooter } =
    useEditToolsActions()
  const { setHeader } = useConfigActions()

  const { config } = useConfig()

  const handleHeaderVisibilityChange: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void = (_, checked) => {
    setHeaderVisibility(checked)

    if (config?.theme?.header?.position === 'fixed') {
      setHeader({ position: 'fixed', top: checked ? 48 : 0 })
    }
  }

  const handleFooterVisibilityChange: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void = (_, checked) => {
    setFooterVisibility(checked)
    if (!checked) {
      setFixedFooter(false)
    }
  }

  const handleFooterFixedChange: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void = (_, checked) => {
    setFixedFooter(checked)
    if (checked) {
      setFooterVisibility(true)
    }
  }

  const showControls =
    config?.theme?.container?.display === 'flex' &&
    config?.theme?.container?.height === '100%'

  return showControls ? (
    <>
      <ControlContainer>
        Show mock header
        <Switch
          checked={showMockHeader}
          onChange={handleHeaderVisibilityChange}
          aria-label="Show the mock header"
        />
      </ControlContainer>
      <ControlContainer>
        <CardRowColumn>
          <ControlRowContainer>
            Show mock footer
            <Switch
              checked={showMockFooter}
              onChange={handleFooterVisibilityChange}
              aria-label="Show the mock footer"
            />
          </ControlRowContainer>
          <ControlRowContainer sx={{ paddingTop: 0 }}>
            Make footer fixed
            <Switch
              checked={isFooterFixed}
              onChange={handleFooterFixedChange}
              aria-label="Show the mock footer"
            />
          </ControlRowContainer>
        </CardRowColumn>
      </ControlContainer>
    </>
  ) : null
}
