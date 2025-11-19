import type React from "react"
import type { Metadata } from "next"
import { Lora, Inter } from "next/font/google"
import "./globals.css"

const lora = Lora({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Memorizando - Guarde para sempre as memórias",
  description: "Crie uma página personalizada para homenagear pessoas especiais",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-background text-foreground`}>{children}</body>
    </html>
  )
}
