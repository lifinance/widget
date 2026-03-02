import { Box, Button, Chip, Typography } from '@mui/material'
import { useConnect, useConnection, useConnectors, useDisconnect } from 'wagmi'

export function WalletHeader() {
  // wagmi v3: useAccount → useConnection
  const { address, isConnected, chainId } = useConnection()

  // wagmi v3: mutateAsync replaces connectAsync; connectors removed from useConnect
  const connect = useConnect()

  // wagmi v3: connectors moved to dedicated useConnectors hook
  const connectors = useConnectors()

  // wagmi v3: mutate replaces disconnect
  const { mutate: disconnect } = useDisconnect()

  return (
    <Box
      px={3}
      py={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid #EEEEEE"
      bgcolor="#FAFAFA"
    >
      <Typography fontWeight={700} fontSize={20}>
        Widget Light — Host
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        {isConnected && chainId && (
          <Chip label={`Chain ${chainId}`} size="small" variant="outlined" />
        )}
        {address && (
          <Typography fontSize={14} color="text.secondary">
            {`${address.slice(0, 6)}…${address.slice(-4)}`}
          </Typography>
        )}
        {!isConnected ? (
          <Box display="flex" gap={1}>
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                variant="contained"
                size="small"
                disableElevation
                disabled={connect.isPending}
                onClick={() => connect.mutateAsync({ connector })}
              >
                {connector.name}
              </Button>
            ))}
          </Box>
        ) : (
          <Button variant="outlined" size="small" onClick={() => disconnect()}>
            Disconnect
          </Button>
        )}
      </Box>
    </Box>
  )
}
