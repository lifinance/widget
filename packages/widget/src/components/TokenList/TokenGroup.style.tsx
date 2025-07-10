import { Accordion, AvatarGroup, styled } from '@mui/material'

export const CustomAccordion = styled(Accordion)<{ isExpanded?: boolean }>(
  ({ theme }) => ({
    background: 'transparent',
    height: 60,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    borderRadius: theme.vars.shape.borderRadius,
    boxShadow: 'none',
    width: '100%',
    '&:hover': {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    },
  })
)

export const CustomAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  flexDirection: 'row',
  marginLeft: theme.spacing(0.75),
  '& .MuiAvatarGroup-root': {
    display: 'flex',
    flexDirection: 'row',
  },
  '& .MuiAvatar-root': {
    width: 16,
    height: 16,
    '&:last-child': {
      marginLeft: '-6px',
    },
  },
}))
