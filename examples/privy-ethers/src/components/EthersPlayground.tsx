import { Box, Button } from '@mui/material'
import { useAccount } from 'wagmi'
import { useEthersSigner } from '../hooks/useEthersSigner'

export const EthersPlayground = () => {
  const { chainId } = useAccount()
  const signer = useEthersSigner({ chainId })

  const handleSignMessage = async () => {
    if (signer) {
      const response = await signer.signMessage('Hello world from ethers')
      console.log({ response })
    }
  }

  return (
    <Box>
      <Button onClick={handleSignMessage}>Ethers: Sign Message</Button>
    </Box>
  )
}
