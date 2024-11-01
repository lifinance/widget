/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MultisigTransaction, MultisigTxDetails } from '@lifi/sdk'
import type { Connector } from 'wagmi'

enum TransactionStatus {
  AWAITING_CONFIRMATIONS = 'AWAITING_CONFIRMATIONS',
  AWAITING_EXECUTION = 'AWAITING_EXECUTION',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

type GatewayTransactionDetails = {
  safeAddress: string
  txId: string
  executedAt?: number
  txStatus: TransactionStatus
  txHash?: string
}

export const getSafeMultisigConfig = (connector: Connector) => {
  const getMultisigTransactionDetails = async (
    txHash: string,
    chainId: number,
    updateIntermediateStatus?: () => void
  ): Promise<MultisigTxDetails> => {
    const safeAppProvider = (await connector.getProvider()) as any
    const safeProviderSDK = safeAppProvider.sdk

    const safeTransactionDetails: GatewayTransactionDetails =
      await safeProviderSDK.txs.getBySafeTxHash(txHash)

    const safeTxHash = safeTransactionDetails.txId

    const safeApiTransactionResponse = await fetch(
      `https://safe-client.safe.global/v1/chains/${chainId}/transactions/${safeTxHash}`
    )

    const safeApiTransactionDetails = await safeApiTransactionResponse.json()

    const nonTerminalStatus = [
      TransactionStatus.SUCCESS,
      TransactionStatus.CANCELLED,
      TransactionStatus.FAILED,
    ]

    const isSafeStatusPending =
      !nonTerminalStatus.includes(safeTransactionDetails.txStatus) &&
      !nonTerminalStatus.includes(safeApiTransactionDetails.txStatus)

    const isAwaitingExecution = [
      safeTransactionDetails.txStatus,
      safeApiTransactionDetails.txStatus,
    ].includes(TransactionStatus.AWAITING_EXECUTION)

    if (isAwaitingExecution) {
      updateIntermediateStatus?.()
    }

    if (isSafeStatusPending) {
      await new Promise((resolve) => {
        setTimeout(resolve, 5000)
      })

      return await getMultisigTransactionDetails(
        txHash,
        chainId,
        updateIntermediateStatus
      )
    }

    if (
      [
        safeTransactionDetails.txStatus,
        safeApiTransactionDetails.txStatus,
      ].includes(TransactionStatus.SUCCESS)
    ) {
      return {
        status: 'DONE',
        txHash: `0x${safeTransactionDetails.txHash?.slice(2)}`,
      }
    }

    if (
      [
        safeTransactionDetails.txStatus,
        safeApiTransactionDetails.txStatus,
      ].includes(TransactionStatus.FAILED)
    ) {
      return {
        status: 'FAILED',
        txHash: `0x${safeTransactionDetails.txHash?.slice(2)}`,
      }
    }

    if (
      [
        safeTransactionDetails.txStatus,
        safeApiTransactionDetails.txStatus,
      ].includes(TransactionStatus.CANCELLED)
    ) {
      return {
        status: 'CANCELLED',
        txHash: `0x${safeTransactionDetails.txHash?.slice(2)}`,
      }
    }

    if (isSafeStatusPending) {
      return {
        status: 'PENDING',
        txHash: `0x${safeTransactionDetails.txHash?.slice(2)}`,
      }
    }

    return {
      status: 'PENDING',
      txHash: `0x${safeTransactionDetails.txHash?.slice(2)}`,
    }
  }

  const sendBatchTransaction = async (
    batchTransactions: MultisigTransaction[]
  ): Promise<`0x${string}`> => {
    const safeAppProvider = (await connector.getProvider()) as any
    const safeProviderSDK = safeAppProvider.sdk

    try {
      const { safeTxHash } = await safeProviderSDK.txs.send({
        txs: batchTransactions,
      })

      return `0x${safeTxHash.slice(2)}`
    } catch (error) {
      throw new Error(error as string)
    }
  }

  return {
    isMultisigWalletClient: connector?.id === 'safe',
    shouldBatchTransactions: connector?.id === 'safe',
    sendBatchTransaction,
    getMultisigTransactionDetails,
  }
}
