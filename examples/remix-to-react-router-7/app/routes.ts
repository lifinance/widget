import { type RouteConfig, route } from '@react-router/dev/routes'

export default [
  route('*?', './routes/_index.tsx'),
  //   ...(await flatRoutes()),
  // Don't include the splat route that's catching widget routes
] satisfies RouteConfig
