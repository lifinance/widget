import type { FC, PropsWithChildren } from 'react'
import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useDefaultElementId } from '../../hooks/useDefaultElementId.js'
import { useSetHeaderHeight } from '../../stores/header/useHeaderStore.js'
import { createElementId, ElementId } from '../../utils/elements.js'
import { stickyHeaderRoutes } from '../../utils/navigationRoutes.js'
import { Container } from './Header.style.js'
import { NavigationHeader } from './NavigationHeader.js'
import { WalletHeader } from './WalletHeader.js'

export const HeaderContainer: FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation()
  const elementId = useDefaultElementId()
  const headerRef = useRef<HTMLDivElement>(null)
  const { setHeaderHeight } = useSetHeaderHeight()

  useLayoutEffect(() => {
    const handleHeaderResize = () => {
      const height = headerRef.current?.getBoundingClientRect().height

      if (height) {
        setHeaderHeight(height)
      }
    }

    let resizeObserver: ResizeObserver

    if (headerRef.current) {
      resizeObserver = new ResizeObserver(handleHeaderResize)
      resizeObserver.observe(headerRef.current)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [setHeaderHeight])

  return (
    <Container
      id={createElementId(ElementId.Header, elementId)}
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
