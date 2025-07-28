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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
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
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        // Delay clearing state until after bottom sheet animation completes
        timeoutRef.current = setTimeout(() => {
          setTokenAddress(undefined)
          setWithoutContractAddress(false)
          timeoutRef.current = undefined
        }, 200)
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
