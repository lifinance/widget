import {
  type EVMChain,
  type ExecutionAction,
  LiFiErrorCode,
  type LiFiStepExtended,
} from '@lifi/sdk'
import type { TFunction } from 'i18next'
import { formatTokenAmount, wrapLongWords } from '../utils/format.js'

export function getErrorMessage(
  t: TFunction,
  getChainById: (chainId: number) => EVMChain | undefined,
  step: LiFiStepExtended,
  failedAction?: ExecutionAction
) {
  const error = failedAction?.error
  if (!error) {
    return {
      title: t('error.title.unknown'),
      message: t('error.message.unknown'),
    }
  }

  const getDefaultErrorMessage = (key?: string) =>
    `${t((key as any) ?? 'error.message.transactionNotSent')} ${t(
      'error.message.remainInYourWallet',
      {
        amount: formatTokenAmount(
          BigInt(step.action.fromAmount),
          step.action.fromToken.decimals
        ),
        tokenSymbol: step.action.fromToken.symbol,
        chainName: getChainById(step.action.fromChainId)?.name ?? '',
      }
    )}`

  let title = ''
  let message = ''
  switch (error.code) {
    case LiFiErrorCode.AllowanceRequired:
      title = t('error.title.allowanceRequired')
      message = t('error.message.allowanceRequired', {
        tokenSymbol: step.action.fromToken.symbol,
      })
      break
    case LiFiErrorCode.BalanceError:
      title = t('error.title.balanceIsTooLow')
      message = getDefaultErrorMessage()
      break
    case LiFiErrorCode.ChainSwitchError:
      title = t('error.title.chainSwitch')
      message = getDefaultErrorMessage()
      break
    case LiFiErrorCode.GasLimitError:
      title = t('error.title.gasLimitIsTooLow')
      message = getDefaultErrorMessage()
      break
    case LiFiErrorCode.InsufficientFunds:
      title = t('error.title.insufficientFunds')
      message = `${t(
        'error.message.insufficientFunds'
      )} ${getDefaultErrorMessage()}`
      break
    case LiFiErrorCode.InsufficientGas:
      title = t('error.title.insufficientGas')
      message = `${t(
        'error.message.insufficientFunds'
      )} ${getDefaultErrorMessage()}`
      break
    case LiFiErrorCode.SlippageError:
      title = t('error.title.slippageNotMet')
      message = t('error.message.slippageThreshold')
      break
    case LiFiErrorCode.TransactionFailed:
      title = t('error.title.transactionFailed')
      message = t('error.message.transactionFailed')
      break
    case LiFiErrorCode.TransactionExpired:
      title = t('error.title.transactionExpired')
      message = t('error.message.transactionExpired')
      break
    case LiFiErrorCode.TransactionSimulationFailed:
      title = t('error.title.transactionSimulationFailed')
      message = t('error.message.transactionSimulationFailed')
      break
    case LiFiErrorCode.WalletChangedDuringExecution:
      title = t('error.title.walletMismatch')
      message = t('error.message.walletChangedDuringExecution')
      break
    case LiFiErrorCode.RateLimitExceeded:
      title = t('error.title.rateLimitExceeded')
      message = t('error.message.rateLimitExceeded')
      break
    case LiFiErrorCode.ThirdPartyError:
      title = t('error.title.thirdPartyError')
      message = t('error.message.thirdPartyError')
      break
    case LiFiErrorCode.TransactionUnderpriced:
      title = t('error.title.transactionUnderpriced')
      message = getDefaultErrorMessage()
      break
    case LiFiErrorCode.TransactionUnprepared:
      title = t('error.title.transactionUnprepared')
      message = getDefaultErrorMessage()
      break
    case LiFiErrorCode.TransactionCanceled:
      title = t('error.title.transactionCanceled')
      message = getDefaultErrorMessage('error.message.transactionCanceled')
      break
    case LiFiErrorCode.TransactionRejected:
      title = t('error.title.transactionRejected')
      message = getDefaultErrorMessage('error.message.transactionRejected')
      break
    case LiFiErrorCode.TransactionConflict:
      title = t('error.title.transactionConflict')
      message = getDefaultErrorMessage('error.message.transactionConflict')
      break
    case LiFiErrorCode.ExchangeRateUpdateCanceled:
      title = t('error.title.exchangeRateUpdateCanceled')
      message = getDefaultErrorMessage()
      break
    case LiFiErrorCode.SignatureRejected:
      title = t('error.title.signatureRejected')
      message = t('error.message.signatureRejected', {
        amount: formatTokenAmount(
          BigInt(step.action.fromAmount),
          step.action.fromToken.decimals
        ),
        tokenSymbol: step.action.fromToken.symbol,
        chainName: getChainById(step.action.fromChainId)?.name ?? '',
      })
      break
    default:
      title = t('error.title.unknown')
      if (failedAction?.txHash) {
        message = t('error.message.transactionFailed')
      } else {
        message = error.message || t('error.message.unknown')
      }
      break
  }
  message = wrapLongWords(message)
  return { title, message }
}
