import type { LoaderFunctionArgs } from 'react-router'

// This is a "splat route" that catches all unmatched URLs
// It's useful for handling requests like Chrome DevTools or other tools
// that might try to access endpoints that don't exist in our app
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  // Return a proper 404 response for any unmatched routes
  throw new Response(
    JSON.stringify({ message: `Route not found: ${url.pathname}` }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

// This component should never render since we always throw in the loader
// But we include it for completeness
export default function SplatRoute() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  )
}
