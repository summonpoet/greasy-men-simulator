import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '油腻男模拟器',
  description: '体验与两个油腻男聊天的感觉',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
