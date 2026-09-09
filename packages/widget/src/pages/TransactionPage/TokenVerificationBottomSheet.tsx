import type { Token } from '@lifi/sdk'
import { Button, Checkbox, FormControlLabel } from '@mui/material'
import type { JSX, Ref, RefObject } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { IconCircle } from '../../components/IconCircle/IconCircle.js'
import { useSetContentHeight } from '../../hooks/useSetContentHeight.js'
import {
  ButtonRow,
  CenterContainer,
  ContentContainer,
  WarningMessage,
  WarningTitle,
} from './TokenValueBottomSheet.style.js'

interface TokenVerificationBottomSheetProps {
  /** Source and/or destination tokens the screening provider flagged. */
  tokens: Token[]
  onContinue(): void
  onCancel?(): void
}

export const TokenVerificationBottomSheet = ({
  tokens,
  onContinue,
  onCancel,
  ref,
}: TokenVerificationBottomSheetProps & {
  ref?: Ref<BottomSheetBase>
}): JSX.Element => {
  const handleCancel = () => {
    // close() reaches onClose, which is onCancel
    ;(ref as RefObject<BottomSheetBase>).current?.close()
  }

  return (
    <BottomSheet ref={ref} onClose={onCancel}>
      <TokenVerificationBottomSheetContent
        tokens={tokens}
        onContinue={onContinue}
        onCancel={handleCancel}
      />
    </BottomSheet>
  )
}

const TokenVerificationBottomSheetContent: React.FC<
  TokenVerificationBottomSheetProps
> = ({ tokens, onCancel, onContinue }) => {
  const [accepted, setAccepted] = useState(false)
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  useSetContentHeight(ref)

  return (
    <ContentContainer ref={ref}>
      <CenterContainer>
        <IconCircle status="error" sx={{ mb: 2.5 }} />
        <WarningTitle>{t('warning.title.tokenFlagged')}</WarningTitle>
      </CenterContainer>
      {tokens.map((token) => (
        <WarningMessage key={`${token.chainId}-${token.address}`}>
          {t('warning.message.tokenFlagged', { tokenSymbol: token.symbol })}
        </WarningMessage>
      ))}
      <FormControlLabel
        control={
          <Checkbox
            checked={accepted}
            onChange={(_, checked) => setAccepted(checked)}
          />
        }
        label={t('warning.checkbox.tokenFlagged')}
        sx={{ mt: 1 }}
      />
      <ButtonRow>
        <Button variant="text" onClick={onCancel} fullWidth>
          {t('button.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onContinue}
          disabled={!accepted}
          fullWidth
        >
          {t('button.continue')}
        </Button>
      </ButtonRow>
    </ContentContainer>
  )
}
