import Done from '@mui/icons-material/Done'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import WarningRounded from '@mui/icons-material/WarningRounded'
import { Box, Button, Skeleton, Typography } from '@mui/material'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { Token } from '../../components/Token/Token.js'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { getProcessMessage } from '../../hooks/useProcessMessage.js'
import { useSetContentHeight } from '../../hooks/useSetContentHeight.js'
import { useTokenBalance } from '../../hooks/useTokenBalance.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import {
  type RouteExecution,
  RouteExecutionStatus,
} from '../../stores/routes/types.js'
import { getSourceTxHash } from '../../stores/routes/utils.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { formatTokenAmount } from '../../utils/format.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { shortenAddress } from '../../utils/wallet.js'
import {
  CenterContainer,
  IconCircle,
  MessageSkeletonContainer,
} from './StatusBottomSheet.style.js'

interface StatusBottomSheetContentProps extends RouteExecution {
  onClose(): void
}

const MessageSkeleton = () => (
  <MessageSkeletonContainer>
    <Skeleton height={24} variant="text" width="92%" />
    <Skeleton height={24} variant="text" width="56%" />
  </MessageSkeletonContainer>
)

export const StatusBottomSheet: React.FC<RouteExecution> = ({
  status,
  route,
}) => {
  const ref = useRef<BottomSheetBase>(null)

  const onClose = useCallback(() => {
    ref.current?.close()
  }, [])

  useEffect(() => {
    const hasSuccessFlag = hasEnumFlag(status, RouteExecutionStatus.Done)
    const hasFailedFlag = hasEnumFlag(status, RouteExecutionStatus.Failed)
    if ((hasSuccessFlag || hasFailedFlag) && !ref.current?.isOpen()) {
      ref.current?.open()
    }
  }, [status])

  return (
    <BottomSheet ref={ref}>
      <StatusBottomSheetContent
        status={status}
        route={route}
        onClose={onClose}
      />
    </BottomSheet>
  )
}

export const StatusBottomSheetContent: React.FC<
  StatusBottomSheetContentProps
> = ({ status, route, onClose }) => {
  const { t } = useTranslation()
  const { navigateBack, navigate } = useNavigateBack()
  const { setFieldValue } = useFieldActions()
  const {
    subvariant,
    subvariantOptions,
    contractSecondaryComponent,
    contractCompactComponent,
  } = useWidgetConfig()
  const { getChainById } = useAvailableChains()

  const ref = useRef<HTMLElement>(null)
  useSetContentHeight(ref)

  const toToken = {
    ...(route.steps.at(-1)?.execution?.toToken ?? route.toToken),
    amount: BigInt(
      route.steps.at(-1)?.execution?.toAmount ??
        route.steps.at(-1)?.estimate.toAmount ??
        route.toAmount
    ),
  }

  const { token, refetch, refetchNewBalance } = useTokenBalance(
    route.toAddress,
    toToken
  )

  const cleanFields = () => {
    setFieldValue('fromAmount', '')
    setFieldValue('toAmount', '')
  }

  const handleDone = () => {
    cleanFields()
    navigateBack()
  }

  const handlePartialDone = () => {
    if (
      toToken.chainId !== route.toToken.chainId &&
      toToken.address !== route.toToken.address
    ) {
      setFieldValue(
        'fromAmount',
        formatTokenAmount(toToken.amount, toToken.decimals),
        { isTouched: true }
      )
      setFieldValue('fromChain', toToken.chainId, { isTouched: true })
      setFieldValue('fromToken', toToken.address, { isTouched: true })
      setFieldValue('toChain', route.toToken.chainId, {
        isTouched: true,
      })
      setFieldValue('toToken', route.toToken.address, {
        isTouched: true,
      })
    } else {
      cleanFields()
    }
    navigateBack()
  }

  const handleClose = () => {
    cleanFields()
    onClose()
  }

  const handleSeeDetails = () => {
    handleClose()

    const transactionHash = getSourceTxHash(route)

    navigate(navigationRoutes.transactionDetails, {
      state: {
        routeId: route.id,
        transactionHash,
      },
      replace: true,
    })
  }

  const transactionType =
    route.fromChainId === route.toChainId ? 'swap' : 'bridge'

  let title: string | undefined
  let primaryMessage: string | undefined
  let secondaryMessage: string | undefined
  let handlePrimaryButton = handleDone
  switch (status) {
    case RouteExecutionStatus.Done: {
      title =
        subvariant === 'custom'
          ? t(
              `success.title.${subvariantOptions?.custom ?? 'checkout'}Successful`
            )
          : t(`success.title.${transactionType}Successful`)
      if (token) {
        primaryMessage = t('success.message.exchangeSuccessful', {
          amount: formatTokenAmount(token.amount, token.decimals),
          tokenSymbol: token.symbol,
          chainName: getChainById(toToken.chainId)?.name,
          walletAddress: shortenAddress(route.toAddress),
        })
      }
      handlePrimaryButton = handleDone
      break
    }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Partial: {
      title = t(`success.title.${transactionType}PartiallySuccessful`)
      primaryMessage = t('success.message.exchangePartiallySuccessful', {
        tool: route.steps.at(-1)?.toolDetails.name,
        tokenSymbol: route.steps.at(-1)?.action.toToken.symbol,
      })
      if (token) {
        secondaryMessage = t('success.message.exchangeSuccessful', {
          amount: formatTokenAmount(token.amount, token.decimals),
          tokenSymbol: token.symbol,
          chainName: getChainById(toToken.chainId)?.name,
          walletAddress: shortenAddress(route.toAddress),
        })
      }
      handlePrimaryButton = handlePartialDone
      break
    }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Refunded: {
      title = t('success.title.refundIssued')
      primaryMessage = t('success.message.exchangePartiallySuccessful', {
        tool: route.steps.at(-1)?.toolDetails.name,
        tokenSymbol: route.steps.at(-1)?.action.toToken.symbol,
      })
      if (token) {
        secondaryMessage = t('success.message.exchangeSuccessful', {
          amount: formatTokenAmount(token.amount, token.decimals),
          tokenSymbol: token.symbol,
          chainName: getChainById(toToken.chainId)?.name,
          walletAddress: shortenAddress(route.toAddress),
        })
      }
      break
    }
    case RouteExecutionStatus.Failed: {
      const step = route.steps.find(
        (step) => step.execution?.status === 'FAILED'
      )
      const process = step?.execution?.process.find(
        (process) => process.status === 'FAILED'
      )
      if (!step || !process) {
        break
      }
      const processMessage = getProcessMessage(t, getChainById, step, process)
      title = processMessage.title
      primaryMessage = processMessage.message
      handlePrimaryButton = handleClose
      break
    }
    default:
      break
  }

  useEffect(() => {
    const hasSuccessFlag = hasEnumFlag(status, RouteExecutionStatus.Done)
    if (hasSuccessFlag) {
      refetchNewBalance()
      refetch()
    }
  }, [refetch, refetchNewBalance, status])

  const showContractComponent =
    subvariant === 'custom' &&
    hasEnumFlag(status, RouteExecutionStatus.Done) &&
    (contractCompactComponent || contractSecondaryComponent)

  return (
    <Box
      ref={ref}
      sx={{
        p: 3,
      }}
    >
      {!showContractComponent ? (
        <CenterContainer>
          <IconCircle status={status} mb={1}>
            {status === RouteExecutionStatus.Idle ? (
              <InfoRounded color="primary" />
            ) : null}
            {status === RouteExecutionStatus.Done ? (
              <Done color="success" />
            ) : null}
            {hasEnumFlag(status, RouteExecutionStatus.Partial) ||
            hasEnumFlag(status, RouteExecutionStatus.Refunded) ? (
              <WarningRounded color="warning" />
            ) : null}
            {hasEnumFlag(status, RouteExecutionStatus.Failed) ? (
              <ErrorRounded color="error" />
            ) : null}
          </IconCircle>
        </CenterContainer>
      ) : null}
      <CenterContainer>
        <Typography
          sx={{
            py: 1,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
      </CenterContainer>
      {showContractComponent ? (
        contractCompactComponent || contractSecondaryComponent
      ) : (
        <CenterContainer>
          {hasEnumFlag(status, RouteExecutionStatus.Done) ? (
            <Token token={toToken} py={1} disableDescription />
          ) : null}
        </CenterContainer>
      )}
      {!showContractComponent ? (
        primaryMessage ? (
          <Typography
            sx={{
              py: 1,
            }}
          >
            {primaryMessage}
          </Typography>
        ) : (
          <MessageSkeleton />
        )
      ) : null}
      {secondaryMessage ? (
        <Typography
          sx={{
            py: 1,
          }}
        >
          {secondaryMessage}
        </Typography>
      ) : null}
      <Box sx={{ display: 'flex', marginTop: 2, gap: 1.5 }}>
        {hasEnumFlag(status, RouteExecutionStatus.Done) ? (
          <Button variant="text" onClick={handleSeeDetails} fullWidth>
            {t('button.seeDetails')}
          </Button>
        ) : null}
        <Button variant="contained" fullWidth onClick={handlePrimaryButton}>
          {status === RouteExecutionStatus.Idle ? t('button.ok') : null}
          {hasEnumFlag(status, RouteExecutionStatus.Done)
            ? t('button.done')
            : null}
          {status === RouteExecutionStatus.Failed
            ? t('button.seeDetails')
            : null}
        </Button>
      </Box>
    </Box>
  )
}
