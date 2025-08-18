import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import { formatEther, getAddress } from 'ethers'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useEthersProvider } from '../hooks/useEthersProvider.js'
import { useEthersSigner } from '../hooks/useEthersSigner.js'

const DEFAULT_MESSAGE_TO_SIGN = 'Privy Wallet + LI.FI widget using ethers'

export const EthersPlayground = () => {
  const { chainId, address } = useAccount()
  const signer = useEthersSigner({ chainId })
  const provider = useEthersProvider({ chainId })

  const [message, setMessage] = useState('')
  const [signMessageStatus, setSignedMessageStatus] = useState<
    'success' | 'error' | undefined
  >()

  const signMessageStatusMessage =
    signMessageStatus === 'success'
      ? 'Message signed successfully'
      : signMessageStatus === 'error'
        ? 'There was a problem with signing message'
        : ''

  const [balance, setBalance] = useState<number | undefined>(undefined)

  const handleSignMessage = async () => {
    if (signer) {
      try {
        await signer.signMessage(
          message.length > 0 ? message : DEFAULT_MESSAGE_TO_SIGN
        )
        setSignedMessageStatus('success')
      } catch {
        setSignedMessageStatus('error')
      } finally {
        setTimeout(() => {
          setSignedMessageStatus(undefined)
        }, 1000 * 7)
      }
    }
  }

  const handleMessageFieldChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault()
    const { value } = e.target
    setMessage(value)
  }

  useEffect(() => {
    const fetchAddressDetails = async () => {
      if (address) {
        const ethersAddress = getAddress(address)
        const balanceBigInt = await provider?.getBalance(ethersAddress)
        const balanceDecimal = balanceBigInt
          ? Number(formatEther(balanceBigInt))
          : 0
        setBalance(balanceDecimal || 0)
      }
    }
    fetchAddressDetails()
  }, [address, provider])

  if (!address) {
    return (
      <Box width="100%">
        <Typography variant="h5" marginBottom={2}>
          Interact using ethers
        </Typography>
        <Typography>Login to interact with your wallet with ethers </Typography>
      </Box>
    )
  }

  return (
    <Box width="100%">
      <Typography variant="h5" marginBottom={2}>
        Interact using ethers
      </Typography>

      <Box display="flex" flexDirection="column" gap={0.5}>
        <Typography variant="body1">Active Address</Typography>
        <Typography variant="caption" marginBottom={1}>
          {address}
        </Typography>
        {balance !== undefined ? (
          <>
            <Typography variant="body1">Balance</Typography>
            <Typography variant="caption">{balance} ETH</Typography>
          </>
        ) : null}
      </Box>
      <Box
        marginY={2}
        display="flex"
        flexDirection="column"
        alignItems="start"
        gap={2}
        width="100%"
      >
        <Typography variant="h6">Sign a message</Typography>
        <TextField
          multiline
          onChange={handleMessageFieldChange}
          value={message}
          placeholder="Enter message to sign"
        />
        <Button
          onClick={handleSignMessage}
          variant="contained"
          sx={{ backgroundColor: 'black' }}
        >
          Sign Message
        </Button>
        {signMessageStatus && (
          <Alert severity={signMessageStatus}>{signMessageStatusMessage}</Alert>
        )}
      </Box>
    </Box>
  )
}
