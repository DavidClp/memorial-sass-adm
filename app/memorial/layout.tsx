import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Memorial - Memorizando",
  description: "Um memorial personalizado em homenagem a quem você ama",
}

export default function PessoaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
