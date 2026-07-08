import { AmountInputCardPair } from '../../components/AmountInputCard/AmountInputCardPair.js'
import { LimitOrderSettings } from '../../components/LimitOrderSettings/LimitOrderSettings.js'
import { PageContainer } from '../../components/PageContainer.js'
import { LimitOrderRoutes } from '../../components/Routes/LimitOrderRoutes.js'
import { MainPageActions } from './MainPageActions.js'

const marginSx = { marginBottom: 2 }

export const LimitPageContent: React.FC = () => {
  return (
    <PageContainer topGutters>
      <AmountInputCardPair sx={marginSx} />
      <LimitOrderSettings sx={marginSx} />
      <LimitOrderRoutes sx={marginSx} />
      <MainPageActions />
    </PageContainer>
  )
}
