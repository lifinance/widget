import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { BottomSheet } from '../BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../BottomSheet/types.js'
import { TokenDetailsSheetContent } from './TokenDetailsSheetContent.js'
import type { TokenDetailsSheetBase } from './types.js'
interface TokenDetailsSheetProps {
  chainId: number | undefined
}

export const TokenDetailsSheet = forwardRef<
  TokenDetailsSheetBase,
  TokenDetailsSheetProps
>(({ chainId }, ref) => {
  const bottomSheetRef = useRef<BottomSheetBase>(null)
  const [tokenAddress, setTokenAddress] = useState<string | undefined>(
    undefined
  )
  const [withoutContractAddress, setWithoutContractAddress] = useState(false)

  useImperativeHandle(
    ref,
    () => ({
      isOpen: () => bottomSheetRef.current?.isOpen(),
      open: (address: string, noContractAddress: boolean) => {
        setTokenAddress(address)
        setWithoutContractAddress(noContractAddress)
        bottomSheetRef.current?.open()
      },
      close: () => {
        bottomSheetRef.current?.close()
        setTokenAddress(undefined)
        setWithoutContractAddress(false)
      },
    }),
    []
  )

  return (
    <BottomSheet ref={bottomSheetRef}>
      <TokenDetailsSheetContent
        ref={ref}
        tokenAddress={tokenAddress}
        withoutContractAddress={withoutContractAddress}
        chainId={chainId}
      />
    </BottomSheet>
  )
})
