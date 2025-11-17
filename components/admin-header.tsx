"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { authUtils } from "@/lib/auth"
import { LogOut } from "lucide-react"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    authUtils.clearToken()
    router.push("/admin")
  }

  return (
    <header className="bg-primary text-white border-b border-primary/80">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">Painel Administrativo</h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-white text-white hover:bg-white/20 bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  )
}
