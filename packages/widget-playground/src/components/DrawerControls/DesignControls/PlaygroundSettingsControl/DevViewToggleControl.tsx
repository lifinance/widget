import { useDevView } from '../../../../hooks/useDevView'
import { CardRowColumn } from '../../../Card/Card.style'
import { Switch } from '../../../Switch'
import {
  CapitalizeFirstLetter,
  ControlContainer,
  ControlRowContainer,
} from '../DesignControls.style'

export const DevViewToggleControls = () => {
  const { isDevView, toggleDevView } = useDevView()

  const handleToggleDevView: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void = (_, _checked) => {
    toggleDevView()
  }

  return (
    <ControlContainer>
      <CardRowColumn>
        <ControlRowContainer sx={{ paddingBottom: 0 }}>
          Dev view
          <Switch
            checked={isDevView}
            onChange={handleToggleDevView}
            aria-label="Show the mock header"
          />
        </ControlRowContainer>
        <ControlRowContainer sx={{ paddingTop: 0, paddingBottom: 1 }}>
          <CapitalizeFirstLetter variant="caption">
            Enables experimental playground controls
          </CapitalizeFirstLetter>
        </ControlRowContainer>
      </CardRowColumn>
    </ControlContainer>
  )
}
