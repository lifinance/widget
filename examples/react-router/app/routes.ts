import { route, type RouteConfig } from '@react-router/dev/routes'

export default [route('*?', './routes/_index.tsx')] satisfies RouteConfig
