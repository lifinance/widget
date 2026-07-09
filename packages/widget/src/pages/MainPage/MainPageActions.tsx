import { Box } from '@mui/material'
import { PoweredBy } from '../../components/PoweredBy/PoweredBy.js'
import { SendToWalletExpandButton } from '../../components/SendToWallet/SendToWalletExpandButton.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { MainWarningMessages } from './MainWarningMessages.js'
import { ReviewButton } from './ReviewButton.js'

interface MainPageActionsProps {
  showSendToWalletExpand?: boolean
}

const marginSx = { marginBottom: 2 }

export const MainPageActions: React.FC<MainPageActionsProps> = ({
  showSendToWalletExpand,
}) => {
  const { hiddenUI } = useWidgetConfig()
  const showPoweredBy = !hiddenUI?.poweredBy

  return (
    <>
      <MainWarningMessages sx={marginSx} />
      <Box
        sx={{
          display: 'flex',
          mb: showPoweredBy ? 1 : 3,
        }}
      >
        <ReviewButton />
        {showSendToWalletExpand ? <SendToWalletExpandButton /> : null}
      </Box>
      {showPoweredBy ? <PoweredBy /> : null}
    </>
  )
}
