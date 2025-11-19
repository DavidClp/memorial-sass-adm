"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-muted">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif font-bold text-primary">
          Ϙ Memorizando
        </Link>
        <nav>
          <Link href="/admin">
            <Button variant="outline">Entrar</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
