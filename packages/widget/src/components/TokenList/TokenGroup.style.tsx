import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AvatarGroup as MuiAvatarGroup,
  accordionSummaryClasses,
  avatarClasses,
  avatarGroupClasses,
  styled,
} from '@mui/material'

export const Accordion = styled(MuiAccordion)(({ theme }) => ({
  background: 'transparent',
  marginBottom: theme.spacing(0.5),
  borderRadius: theme.vars.shape.borderRadius,
  boxShadow: 'none',
  width: '100%',
}))

export const AvatarGroup = styled(MuiAvatarGroup)(({ theme }) => ({
  flexDirection: 'row',
  marginLeft: theme.spacing(0.75),
  [`& .${avatarGroupClasses.root}`]: {
    display: 'flex',
    flexDirection: 'row',
  },
  [`& .${avatarClasses.root}`]: {
    width: 16,
    height: 16,
    '&:last-child': {
      marginLeft: '-6px',
    },
  },
}))

export const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  padding: 0,
  height: 60,
  borderRadius: theme.vars.shape.borderRadius,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  },
  [`& .${accordionSummaryClasses.content}`]: {
    margin: 0,
    alignItems: 'center',
  },
}))
