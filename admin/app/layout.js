import './globals.css'

export const metadata = {
  title: 'Admin Panel - Movie Review',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
