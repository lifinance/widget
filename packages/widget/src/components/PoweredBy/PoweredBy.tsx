import { Box, Tooltip, Typography } from '@mui/material'
import { version } from '../../config/version.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { Link } from './PoweredBy.style.js'

const poweredByConfig = {
  default: {
    url: 'https://li.fi',
    text: 'LI.FI',
  },
  jumper: {
    url: 'https://jumper.exchange',
    text: 'Jumper',
  },
}

export const PoweredBy: React.FC = () => {
  const { poweredBy = 'default' } = useWidgetConfig()

  return (
    <Box
      pt={1}
      pb={2}
      flex={1}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      }}
    >
      <Tooltip title={`v${version}`} enterDelay={1000}>
        <Link
          href={poweredByConfig[poweredBy].url}
          target="_blank"
          underline="none"
          color="text.primary"
        >
          <Typography
            color="text.secondary"
            fontSize={12}
            fontWeight={500}
            px={0.5}
          >
            Powered by
          </Typography>
          <Typography color="text.primary" fontSize={12} fontWeight={600}>
            {poweredByConfig[poweredBy].text}
          </Typography>
        </Link>
      </Tooltip>
    </Box>
  )
}
