import type { JSX, Ref } from 'react'
import { useImperativeHandle, useRef, useState } from 'react'
import type { TokenAmount } from '../../types/token.js'
import { BottomSheet } from '../BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../BottomSheet/types.js'
import { TokenDetailsSheetContent } from './TokenDetailsSheetContent.js'
import type { TokenDetailsSheetBase } from './types.js'

export const TokenDetailsSheet = ({
  ref,
}: {
  ref?: Ref<TokenDetailsSheetBase>
}): JSX.Element => {
  const bottomSheetRef = useRef<BottomSheetBase>(null)
  const [listToken, setListToken] = useState<TokenAmount | undefined>(undefined)
  const [withoutContractAddress, setWithoutContractAddress] = useState(false)

  useImperativeHandle(
    ref,
    () => ({
      isOpen: () => bottomSheetRef.current?.isOpen(),
      open: (token: TokenAmount, noContractAddress: boolean) => {
        setListToken(token)
        setWithoutContractAddress(noContractAddress)
        bottomSheetRef.current?.open()
      },
      close: () => {
        bottomSheetRef.current?.close()
      },
    }),
    []
  )

  return (
    <BottomSheet ref={bottomSheetRef} keepMounted>
      <TokenDetailsSheetContent
        onClose={() => bottomSheetRef.current?.close()}
        listToken={listToken}
        withoutContractAddress={withoutContractAddress}
      />
    </BottomSheet>
  )
}
