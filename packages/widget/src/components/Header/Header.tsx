import { useLocation } from '@tanstack/react-router'
import type { FC, PropsWithChildren } from 'react'
import { useCallback } from 'react'
import { useDefaultElementId } from '../../hooks/useDefaultElementId.js'
import { useSetHeaderHeight } from '../../stores/header/useHeaderStore.js'
import { createElementId, ElementId } from '../../utils/elements.js'
import { stickyHeaderRoutes } from '../../utils/navigationRoutes.js'
import { Container } from './Header.style.js'
import { NavigationHeader } from './NavigationHeader.js'
import { WalletHeader } from './WalletHeader.js'

const HeaderContainer: FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation()
  const elementId = useDefaultElementId()
  const { setHeaderHeight } = useSetHeaderHeight()

  // React 19 ref cleanup callback: set up the ResizeObserver when the node
  // mounts and tear it down when it unmounts.
  const headerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        return
      }

      const handleHeaderResize = () => {
        const height = node.getBoundingClientRect().height

        if (height) {
          setHeaderHeight(height)
        }
      }

      const resizeObserver = new ResizeObserver(handleHeaderResize)
      resizeObserver.observe(node)

      return () => {
        resizeObserver.disconnect()
      }
    },
    [setHeaderHeight]
  )

  return (
    <Container
      id={createElementId(ElementId.Header, elementId ?? '')}
      sticky={stickyHeaderRoutes.some((route) => pathname.includes(route))}
      ref={headerRef}
    >
      {children}
    </Container>
  )
}

export const Header: FC = () => {
  return (
    <HeaderContainer>
      <WalletHeader />
      <NavigationHeader />
    </HeaderContainer>
  )
}
