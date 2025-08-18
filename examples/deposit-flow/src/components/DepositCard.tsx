import {
  type ContractCall,
  type TokenAmount,
  useFieldActions,
} from '@lifi/widget'
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import { contractTool } from '../config.js'

export interface ItemPriceProps {
  token: TokenAmount
  contractCalls?: ContractCall[]
}

export const DepositCard: React.FC<ItemPriceProps> = ({
  token,
  contractCalls,
}) => {
  const { setFieldValue } = useFieldActions()

  useEffect(() => {
    if (token) {
      setFieldValue('toChain', token.chainId, { isTouched: true })
      setFieldValue('toToken', token.address, { isTouched: true })
    }
    if (contractCalls) {
      setFieldValue('contractCalls', contractCalls, {
        isTouched: true,
      })
    }
  }, [contractCalls, setFieldValue, token])
  return (
    <Stack spacing={2} padding={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <Avatar alt="Protocol" src={contractTool.logoURI} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Protocol Name
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderRadius: 1,
            paddingX: 2,
            paddingY: 1,
            flex: 1,
          }}
        >
          <Typography variant="subtitle2">TVL</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            $69M
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderRadius: 1,
            paddingX: 2,
            paddingY: 1,
            flex: 1,
          }}
        >
          <Typography variant="subtitle2">Incentives</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            $4.2M
          </Typography>
        </Box>
      </Box>
      <Box display="flex" gap={1}>
        <Chip label="USDC" avatar={<Avatar alt="USDC" src={token.logoURI} />} />
        <Chip
          label="Vault"
          avatar={
            <Avatar
              alt="Vault"
              src={'https://gravatar.com/avatar/any?d=retro'}
            />
          }
        />
      </Box>
    </Stack>
  )
}
