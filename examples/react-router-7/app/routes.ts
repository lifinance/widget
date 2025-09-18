import { type RouteConfig, route } from '@react-router/dev/routes'

export default [route('*?', './routes/_index.tsx')] satisfies RouteConfig
