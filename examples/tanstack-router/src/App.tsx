import type { WidgetConfig } from '@lifi/widget'
import { LiFiWidget } from '@lifi/widget'
import {
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { useMemo } from 'react'

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = location.pathname

  const linkStyle = {
    textDecoration: 'none',
    color: '#1976d2',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
  }

  const activeLinkStyle = {
    ...linkStyle,
    textDecoration: 'underline',
  }

  return (
    <nav style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault()
          navigate({ to: '/' })
        }}
        style={currentPath === '/' ? activeLinkStyle : linkStyle}
      >
        Home
      </a>
      <a
        href="/widget"
        onClick={(e) => {
          e.preventDefault()
          navigate({ to: '/widget' as any })
        }}
        style={currentPath === '/widget' ? activeLinkStyle : linkStyle}
      >
        Widget
      </a>
      <a
        href="/settings"
        onClick={(e) => {
          e.preventDefault()
          navigate({ to: '/settings' as any })
        }}
        style={currentPath === '/settings' ? activeLinkStyle : linkStyle}
      >
        Settings
      </a>
    </nav>
  )
}

const rootRoute = createRootRoute({
  component: () => (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px' }}>
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div>
      <h2>Welcome to TanStack Router Example</h2>
      <p>
        This example demonstrates how to use TanStack Router to wrap the LiFi
        Widget.
      </p>
      <p>
        The widget uses TanStack Router internally for its own routing, and here
        we're using it at the app level as well to create a multi-page
        application.
      </p>
      <p>
        Navigate to the <strong>Widget</strong> page to see the LiFi Widget in
        action.
      </p>
    </div>
  ),
})

const widgetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/widget',
  component: WidgetPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <div>
      <h2>Settings</h2>
      <p>Application settings page.</p>
      <p>
        This demonstrates how TanStack Router can be used to create a multi-page
        application with the LiFi Widget integrated on specific routes.
      </p>
    </div>
  ),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  widgetRoute,
  settingsRoute,
])

function WidgetPage() {
  const config = {
    appearance: 'light',
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
    },
  } as Partial<WidgetConfig>

  return (
    <div>
      <h2>LiFi Widget</h2>
      <p style={{ marginBottom: '20px' }}>
        The widget below uses TanStack Router internally for navigation between
        its own pages (settings, token selection, etc.).
      </p>
      <LiFiWidget config={config} integrator="tanstack-router-example" />
    </div>
  )
}

function App() {
  const router = useMemo(() => {
    const history = createBrowserHistory()

    return createRouter({
      routeTree,
      history,
    })
  }, [])

  return <RouterProvider router={router} />
}

export default App
