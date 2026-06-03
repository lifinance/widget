import { Box, styled } from '@mui/material'
import type { ComponentProps, FC } from 'react'
import {
  buildThemePreviewBoxShadow,
  THEME_PREVIEW_LAYOUT,
} from '../../utils/themePreview.js'

const { width, height, borderRadius, headerPill, card, cardText, button } =
  THEME_PREVIEW_LAYOUT

interface PreviewRootProps {
  bgColor: string
  outlineColor: string
}

export const PreviewRoot: FC<ComponentProps<typeof Box> & PreviewRootProps> =
  styled(Box, {
    shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'outlineColor',
  })<PreviewRootProps>(({ theme, bgColor, outlineColor }) => ({
    flex: `0 0 ${width}px`,
    width,
    height,
    borderRadius,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: bgColor,
    boxShadow: buildThemePreviewBoxShadow(theme, outlineColor),
  }))

interface PreviewHeaderPillProps {
  pillColor: string
}

export const PreviewHeaderPill: FC<
  ComponentProps<typeof Box> & PreviewHeaderPillProps
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'pillColor',
})<PreviewHeaderPillProps>(({ theme, pillColor }) => ({
  position: 'absolute',
  top: headerPill.top,
  left: theme.spacing(1.5),
  width: headerPill.width,
  height: headerPill.height,
  borderRadius: headerPill.borderRadius,
  backgroundColor: pillColor,
}))

interface PreviewCardProps {
  cardBg: string
  cardBorder: string
}

export const PreviewCard: FC<ComponentProps<typeof Box> & PreviewCardProps> =
  styled(Box, {
    shouldForwardProp: (prop) => prop !== 'cardBg' && prop !== 'cardBorder',
  })<PreviewCardProps>(({ theme, cardBg, cardBorder }) => ({
    position: 'absolute',
    top: card.top,
    left: theme.spacing(1.5),
    width: card.width,
    height: card.height,
    borderRadius: card.borderRadius,
    overflow: 'hidden',
    backgroundColor: cardBg,
    border: `0.5px solid ${cardBorder}`,
  }))

interface PreviewCardTextProps {
  textColor: string
}

export const PreviewCardText: FC<
  ComponentProps<typeof Box> & PreviewCardTextProps
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'textColor',
})<PreviewCardTextProps>(({ textColor }) => ({
  position: 'absolute',
  top: cardText.inset,
  left: cardText.inset,
  width: cardText.width,
  height: cardText.height,
  borderRadius: cardText.borderRadius,
  backgroundColor: textColor,
}))

interface PreviewButtonProps {
  buttonColor: string
}

export const PreviewButton: FC<
  ComponentProps<typeof Box> & PreviewButtonProps
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'buttonColor',
})<PreviewButtonProps>(({ theme, buttonColor }) => ({
  position: 'absolute',
  top: button.top,
  left: theme.spacing(1.5),
  width: button.width,
  height: button.height,
  borderRadius: button.borderRadius,
  backgroundColor: buttonColor,
}))
