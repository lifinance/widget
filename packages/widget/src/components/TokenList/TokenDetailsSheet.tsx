import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { BottomSheet } from '../BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../BottomSheet/types.js'
import { TokenDetailsSheetContent } from './TokenDetailsSheetContent.js'
import type { TokenDetailsSheetBase } from './types.js'

export const TokenDetailsSheet = forwardRef<TokenDetailsSheetBase>((_, ref) => {
  const bottomSheetRef = useRef<BottomSheetBase>(null)
  const [tokenAddress, setTokenAddress] = useState<string | undefined>(
    undefined
  )
  const [chainId, setChainId] = useState<number | undefined>(undefined)
  const [withoutContractAddress, setWithoutContractAddress] = useState(false)

  useImperativeHandle(
    ref,
    () => ({
      isOpen: () => bottomSheetRef.current?.isOpen(),
      open: (address: string, noContractAddress: boolean, chainId: number) => {
        setTokenAddress(address)
        setWithoutContractAddress(noContractAddress)
        setChainId(chainId)
        bottomSheetRef.current?.open()
      },
      close: () => {
        bottomSheetRef.current?.close()
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
