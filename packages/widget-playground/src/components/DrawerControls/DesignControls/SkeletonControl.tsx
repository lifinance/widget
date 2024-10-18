import { useEffect } from 'react'
import { useEditToolsActions } from '../../../store/editTools/useEditToolsActions'
import { useSkeletonToolValues } from '../../../store/editTools/useSkeletonToolValues'
import { useConfigVariant } from '../../../store/widgetConfig/useConfigValues'
import { CardRowContainer, CardValue } from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
import { Switch } from '../../Switch'

export const SkeletonControl = () => {
  const { isSkeletonShown, isSkeletonSideBySide } = useSkeletonToolValues()
  const { setSkeletonShow, setSkeletonSideBySide } = useEditToolsActions()
  const { variant } = useConfigVariant()

  useEffect(() => {
    if (variant === 'drawer') {
      setSkeletonShow(false)
    }
  }, [variant, setSkeletonShow])
  const handleShowHideChange: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void = (_, _checked) => {
    setSkeletonShow(!isSkeletonShown)
  }

  const handleSideBySideChange: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void = (_, _checked) => {
    setSkeletonSideBySide(!isSkeletonSideBySide)
  }

  const disabled = variant === 'drawer'

  return (
    <ExpandableCard
      title={'Skeleton'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>
          {isSkeletonShown ? 'shown' : 'hidden'}
        </CardValue>
      }
    >
      <CardRowContainer sx={{ paddingBottom: 0 }}>
        Show skeleton
        <Switch
          checked={isSkeletonShown}
          onChange={handleShowHideChange}
          aria-label="Show the widget skeleton"
          disabled={disabled}
        />
      </CardRowContainer>
      <CardRowContainer>
        Show side by side
        <Switch
          checked={isSkeletonSideBySide}
          onChange={handleSideBySideChange}
          aria-label="Show the widget skeleton side by side"
          disabled={disabled}
        />
      </CardRowContainer>
    </ExpandableCard>
  )
}
