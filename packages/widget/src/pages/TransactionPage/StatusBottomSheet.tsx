import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { Card } from '../../components/Card/Card.js'
import { CardTitle } from '../../components/Card/CardTitle.js'
import type { StatusColor } from '../../components/IconCircle/IconCircle.js'
import { IconCircle } from '../../components/IconCircle/IconCircle.js'
import { Token } from '../../components/Token/Token.js'
import { WalletAddressBadge } from '../../components/WalletAddressBadge/WalletAddressBadge.js'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useSetContentHeight } from '../../hooks/useSetContentHeight.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import {
  type RouteExecution,
  RouteExecutionStatus,
} from '../../stores/routes/types.js'
import { getSourceTxHash } from '../../stores/routes/utils.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { formatTokenAmount } from '../../utils/format.js'
import { getErrorMessage } from '../../utils/getErrorMessage.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { CenterContainer } from './StatusBottomSheet.style.js'

const mapRouteStatus = (status: RouteExecutionStatus): StatusColor => {
  if (hasEnumFlag(status, RouteExecutionStatus.Partial)) {
    return 'warning'
  }
  if (hasEnumFlag(status, RouteExecutionStatus.Refunded)) {
    return 'warning'
  }
  if (hasEnumFlag(status, RouteExecutionStatus.Failed)) {
    return 'error'
  }
  if (status === RouteExecutionStatus.Done) {
    return 'success'
  }
  return 'info'
}

interface StatusBottomSheetContentProps extends RouteExecution {
  onClose(): void
}

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

const StatusBottomSheetContent: React.FC<StatusBottomSheetContentProps> = ({
  status,
  route,
  onClose,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setFieldValue } = useFieldActions()
  const {
    subvariant,
    subvariantOptions,
    contractSecondaryComponent,
    contractCompactComponent,
    feeConfig,
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

  const cleanFields = () => {
    setFieldValue('fromAmount', '')
    setFieldValue('toAmount', '')
  }

  const handleDone = () => {
    cleanFields()
    navigate({ to: navigationRoutes.home, replace: true })
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
    navigate({ to: navigationRoutes.home, replace: true })
  }

  const handleClose = () => {
    cleanFields()
    onClose()
  }

  const handleSeeDetails = () => {
    handleClose()

    const transactionHash = getSourceTxHash(route)

    navigate({
      to: navigationRoutes.transactionDetails,
      search: {
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
  let failedMessage: string | undefined
  let handlePrimaryButton = handleDone
  switch (status) {
    case RouteExecutionStatus.Done: {
      title =
        subvariant === 'custom'
          ? t(
              `success.title.${subvariantOptions?.custom ?? 'checkout'}Successful`
            )
          : t(`success.title.${transactionType}Successful`)
      handlePrimaryButton = handleDone
      break
    }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Partial: {
      title = t(`success.title.${transactionType}PartiallySuccessful`)
      primaryMessage = t('success.message.exchangePartiallySuccessful', {
        tool: route.steps.at(-1)?.toolDetails.name,
        tokenSymbol: route.steps.at(-1)?.action.toToken.symbol,
      })
      handlePrimaryButton = handlePartialDone
      break
    }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Refunded: {
      title = t('success.title.refundIssued')
      primaryMessage = t('success.message.exchangePartiallySuccessful', {
        tool: route.steps.at(-1)?.toolDetails.name,
        tokenSymbol: route.steps.at(-1)?.action.toToken.symbol,
      })
      break
    }
    case RouteExecutionStatus.Failed: {
      const step = route.steps.find(
        (step) => step.execution?.status === 'FAILED'
      )
      if (!step) {
        break
      }
      const action = step.execution?.actions.find(
        (action) => action.status === 'FAILED'
      )
      const actionMessage = getErrorMessage(t, getChainById, step, action)
      title = actionMessage.title
      failedMessage = actionMessage.message
      handlePrimaryButton = handleClose
      break
    }
    default:
      break
  }

  const showContractComponent =
    subvariant === 'custom' &&
    hasEnumFlag(status, RouteExecutionStatus.Done) &&
    (contractCompactComponent || contractSecondaryComponent)

  const VcComponent =
    status === RouteExecutionStatus.Done ? feeConfig?._vcComponent : undefined

  return (
    <Box
      ref={ref}
      sx={{
        p: 3,
      }}
    >
      {!showContractComponent ? (
        <CenterContainer>
          <IconCircle status={mapRouteStatus(status)} mb={1} />
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
      ) : hasEnumFlag(status, RouteExecutionStatus.Failed) && failedMessage ? (
        <Typography
          sx={{
            py: 1,
          }}
        >
          {failedMessage}
        </Typography>
      ) : hasEnumFlag(status, RouteExecutionStatus.Done) ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginTop: 2,
            marginBottom: VcComponent ? 2 : 3,
          }}
        >
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              padding: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <CardTitle sx={{ padding: 0 }}>
                {hasEnumFlag(status, RouteExecutionStatus.Refunded)
                  ? t('header.refunded')
                  : t('header.received')}
              </CardTitle>
              {route.toAddress ? (
                <WalletAddressBadge address={route.toAddress} />
              ) : null}
            </Box>
            <Token token={toToken} disableDescription={false} />
            {primaryMessage && (
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 500,
                }}
              >
                {primaryMessage}
              </Typography>
            )}
          </Card>
          {VcComponent ? <VcComponent route={route} /> : null}
        </Box>
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
