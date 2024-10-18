import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Box,
  ClickAwayListener,
  IconButton,
  Popper,
  Tooltip,
  Typography,
} from '@mui/material'
import type { MouseEventHandler } from 'react'
import { useState } from 'react'
import { useFontToolValues } from '../../../store/editTools/useFontToolValues'
import { popperZIndex, tooltipPopperZIndex } from '../DrawerControls.style'
import {
  FontEmbedPopperContainer,
  FontMessageCloseButton,
  GoogleFontLink,
} from './CodeControl.style'

interface FontMessageProps {
  fontFamily: string
}
const GoogleFontMessage = ({ fontFamily }: FontMessageProps) => (
  <>
    <Typography variant="body2">
      You have selected the Google Font <strong>"{fontFamily}"</strong> for use
      with the widget.
    </Typography>
    <Typography variant="body2">
      You can visit{' '}
      <GoogleFontLink
        href={`https://fonts.google.com/specimen/${fontFamily.replace(' ', '+')}`}
        rel="nofollow"
        target="_blank"
      >
        the {fontFamily} page on Google fonts{' '}
        <OpenInNewIcon fontSize="inherit" />
      </GoogleFontLink>{' '}
      to find out how to embed this font.
    </Typography>
    <Typography variant="body2">
      Ensure the embedded fonts include the font weights <strong>400</strong>,{' '}
      <strong>500</strong>, <strong>600</strong>, and <strong>700</strong> for
      best display of the widget.
    </Typography>
  </>
)

const CustomFontMessage = ({ fontFamily }: FontMessageProps) => (
  <>
    <Typography variant="body2">
      You have specified the font <strong>"{fontFamily}"</strong> for use with
      the widget.
    </Typography>
    <Typography variant="body2">
      Font embedding will not be handled by the widget. You will need to make
      sure the font is embedded correctly in your application.
    </Typography>
    <Typography variant="body2">
      Ensure the embedded fonts include the font weights <strong>400</strong>,{' '}
      <strong>500</strong>, <strong>600</strong>, and <strong>700</strong> for
      best display of the widget.
    </Typography>
  </>
)

export const FontEmbedInfo = () => {
  const { selectedFont } = useFontToolValues()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = !!anchorEl

  const id = open ? 'font-embedding-popper' : undefined

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClickAway = () => {
    setAnchorEl(null)
  }

  return selectedFont && selectedFont.source !== 'System fonts' ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2">You will need to embed fonts</Typography>
      <Tooltip
        title="More about fonts"
        PopperProps={{ style: { zIndex: tooltipPopperZIndex } }}
        arrow
      >
        <IconButton aria-describedby={id} onClick={handleClick}>
          <InfoIcon />
        </IconButton>
      </Tooltip>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        sx={{ zIndex: popperZIndex }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <FontEmbedPopperContainer>
            <FontMessageCloseButton onClick={handleClickAway}>
              <CloseIcon fontSize="small" />
            </FontMessageCloseButton>
            {selectedFont.source === 'Google fonts' ? (
              <GoogleFontMessage fontFamily={selectedFont.family} />
            ) : selectedFont.source === 'Custom fonts' ? (
              <CustomFontMessage fontFamily={selectedFont.family} />
            ) : null}
          </FontEmbedPopperContainer>
        </ClickAwayListener>
      </Popper>
    </Box>
  ) : null
}
