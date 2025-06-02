import type { PropsWithChildren } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { WalletMenuContent } from '../../components/WalletMenuContent.js'
import { WalletMenuModal } from '../../components/WalletMenuModal.js'
import { I18nProvider } from '../I18nProvider/I18nProvider.js'
import { useWalletManagementConfig } from '../WalletManagementProvider/WalletManagementContext.js'
import { WalletMenuContext } from './WalletMenuContext.js'
import type {
  WalletMenuOpenArgs,
  WalletMenuContext as _WalletMenuContext,
} from './types.js'

export const WalletMenuProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { locale } = useWalletManagementConfig()
  const openRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [walletChainArgs, setWalletChainArgs] = useState<
    WalletMenuOpenArgs | undefined
  >(undefined)

  const toggleWalletMenu = useCallback(() => {
    setOpen((open) => {
      openRef.current = !open
      return openRef.current
    })
  }, [])

  const openWalletMenu = useCallback((args?: WalletMenuOpenArgs) => {
    if (args) {
      setWalletChainArgs(args)
    }
    setOpen(true)
    openRef.current = true
  }, [])

  const closeWalletMenu = useCallback(() => {
    setOpen(false)
    openRef.current = false
    setWalletChainArgs(undefined)
  }, [])

  const context: _WalletMenuContext = useMemo(
    () => ({
      isWalletMenuOpen: () => openRef.current,
      toggleWalletMenu,
      openWalletMenu,
      closeWalletMenu,
    }),
    [closeWalletMenu, openWalletMenu, toggleWalletMenu]
  )

  return (
    <WalletMenuContext.Provider value={context}>
      {children}
      <I18nProvider locale={locale}>
        <WalletMenuModal open={open} onClose={closeWalletMenu}>
          <WalletMenuContent
            onClose={closeWalletMenu}
            walletChainArgs={walletChainArgs}
          />
        </WalletMenuModal>
      </I18nProvider>
    </WalletMenuContext.Provider>
  )
}
