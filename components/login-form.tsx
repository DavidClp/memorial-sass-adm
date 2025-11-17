"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { api } from "@/lib/api"
import { authUtils } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await api.login(email, senha)

      router.push("/admin/dashboard")
    } catch (err) {
      setError("Email ou senha inválidos")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto p-8 bg-background border-muted">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">EternoMemorial</h1>
        <p className="text-foreground/70">Acesso ao painel administrativo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="admin@eternomemorial.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="bg-white border-muted"
          />
          <p className="text-xs text-foreground/50 mt-1">Demo: admin@eternomemorial.com</p>
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-foreground mb-2">
            Senha
          </label>
          <Input
            id="senha"
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={isLoading}
            className="bg-white border-muted"
          />
          <p className="text-xs text-foreground/50 mt-1">Demo: 1234</p>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-muted text-center text-sm text-foreground/60">
        <p>Credenciais de demonstração:</p>
        <p className="font-mono text-xs mt-2">admin@eternomemorial.com / 1234</p>
      </div>
    </Card>
  )
}
