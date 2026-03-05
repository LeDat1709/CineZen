import './globals.css'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'CineZen - Movie & Series Reviews | Discover Cinema',
    template: '%s | CineZen'
  },
  description: 'Discover the world of cinema through quality reviews. Your destination for movie and series reviews, ratings, and recommendations.',
  keywords: ['movie reviews', 'series reviews', 'cinema', 'film reviews', 'tv shows', 'entertainment', 'streaming'],
  authors: [{ name: 'CineZen' }],
  creator: 'CineZen',
  publisher: 'CineZen',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'CineZen',
    title: 'CineZen - Movie & Series Reviews',
    description: 'Discover the world of cinema through quality reviews',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CineZen - Movie & Series Reviews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineZen - Movie & Series Reviews',
    description: 'Discover the world of cinema through quality reviews',
    images: ['/og-image.jpg'],
    creator: '@cinezen',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        {children}
      </body>
    </html>
  )
}
