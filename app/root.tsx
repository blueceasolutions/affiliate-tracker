import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import type { Route } from './+types/root'
import './app.css'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Bluecea Affiliate Program | Partner & Earn' },
    {
      name: 'description',
      content:
        'Join the Bluecea Affiliate Program to partner with a leading B2B service provider. Earn competitive commissions by referring clients to our enterprise solutions.',
    },
    { name: 'robots', content: 'index, follow' },

    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Bluecea' },
    {
      property: 'og:title',
      content: 'Bluecea Affiliate Program | Partner & Earn',
    },
    {
      property: 'og:description',
      content:
        'Join the Bluecea Affiliate Program to partner with a leading B2B service provider. Earn competitive commissions by referring clients to our enterprise solutions.',
    },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:title',
      content: 'Bluecea Affiliate Program | Partner & Earn',
    },
    {
      name: 'twitter:description',
      content:
        'Join the Bluecea Affiliate Program to partner with a leading B2B service provider. Earn competitive commissions by referring clients to our enterprise solutions.',
    },
  ]
}

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

/**
 * Inline script that runs before React hydrates to apply the saved theme class.
 * This prevents the white flash on initial dark-mode page load.
 */
const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('bluecea-theme') || 'auto';
    var isDark = t === 'dark' || (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
  } catch(e){}
})();
`

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        {/* Must run before any paint — prevents dark-mode flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Bluecea',
              url: 'https://affiliate.bluecea.com',
              logo: 'https://affiliate.bluecea.com/logo.png',
              description:
                'Bluecea Affiliate Program partners with leading B2B service providers to offer competitive referral commissions.',
            }),
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
