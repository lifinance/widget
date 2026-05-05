import { Outlet, useLocation } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { createElementId, ElementId } from '../utils/elements.js'
import { Container, ExpandedContainer } from './components/Container.js'
import { Header } from './components/Header.js'
import { checkoutNavigationRoutes } from './utils/navigationRoutes.js'

export const CheckoutLayout: React.FC = () => {
  const { elementId } = useWidgetConfig()
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const title = useMemo(() => {
    const p = (pathname.endsWith('/') ? pathname.slice(0, -1) : pathname) || '/'
    const segment = p.substring(p.lastIndexOf('/') + 1)
    if (p === checkoutNavigationRoutes.home || segment === '') {
      return t('checkout.chooseFundingSource')
    }
    return t('checkout.deposit')
  }, [pathname, t])

  return (
    <ExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
    >
      <Container>
        <Header title={title} />
        <Outlet />
      </Container>
    </ExpandedContainer>
  )
}
