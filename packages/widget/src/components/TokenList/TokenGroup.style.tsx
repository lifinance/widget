import { Accordion, AvatarGroup, styled } from '@mui/material'

export const CustomAccordion = styled(Accordion)<{ isExpanded?: boolean }>(
  ({ theme }) => ({
    background: 'transparent',
    //height: 60,
    borderRadius: theme.vars.shape.borderRadius,
    border: 0,
    boxShadow: 'none',
    width: '100%',
    '& .MuiAccordionSummary-root': {
      padding: theme.spacing(1),
      borderRadius: theme.vars.shape.borderRadius,
      '&:hover': {
        borderRadius: theme.vars.shape.borderRadius,
        backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
      },
    },
    variants: [
      {
        props: ({ isExpanded }) => isExpanded,
        style: {
          '& .MuiAccordionSummary-root': {
            '&:hover': {
              borderRadius: '16px 16px 0 0',
            },
          },
        },
      },
    ],
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
