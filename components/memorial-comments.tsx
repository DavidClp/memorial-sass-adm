"use client"

import { useEffect, useState, useCallback } from "react"
import { api, type Comentario, type ComentariosResponse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Send, ChevronLeft, ChevronRight } from "lucide-react"

interface MemorialCommentsProps {
  memorialSlug: string
}

const COMENTARIOS_POR_PAGINA = 5

export function MemorialComments({ memorialSlug }: MemorialCommentsProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalComentarios, setTotalComentarios] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [nome, setNome] = useState("")
  const [texto, setTexto] = useState("")
  const [erro, setErro] = useState("")

  const carregarComentarios = useCallback(async (pagina: number) => {
    try {
      setIsLoading(true)
      const response: ComentariosResponse = await api.getComentarios(
        memorialSlug,
        pagina,
        COMENTARIOS_POR_PAGINA
      )
      setComentarios(response.comentarios)
      setTotalPaginas(response.totalPaginas)
      setTotalComentarios(response.total)
    } catch (err) {
      console.error("Erro ao carregar comentários:", err)
      setComentarios([])
    } finally {
      setIsLoading(false)
    }
  }, [memorialSlug])

  useEffect(() => {
    carregarComentarios(paginaAtual)
  }, [carregarComentarios, paginaAtual])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!texto.trim()) {
      setErro("Por favor, digite uma condolência")
      return
    }

    try {
      setIsSubmitting(true)
      setErro("")
      await api.createComentario(memorialSlug, {
        nome: nome.trim() || undefined,
        texto: texto.trim(),
      })
      
      // Limpar formulário
      setNome("")
      setTexto("")
      
      // Recarregar comentários da primeira página para mostrar o novo comentário
      const novaPagina = 1
      setPaginaAtual(novaPagina)
      await carregarComentarios(novaPagina)
    } catch (err: any) {
      setErro(err.message || "Erro ao publicar comentário. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatarData = (data: string) => {
    try {
      const date = new Date(data)
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return data
    }
  }

  return (
    <section className="mt-16">
      <div className="bg-background rounded-lg p-8 shadow-sm border border-muted">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5 text-foreground/70" />
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Condolências
          </h2>
          {totalComentarios > 0 && (
            <span className="text-sm text-foreground/60">
              ({totalComentarios})
            </span>
          )}
        </div>

        {/* Lista de Comentários */}
        {isLoading ? (
          <div className="py-8 text-center text-foreground/70">
            Carregando condolências...
          </div>
        ) : comentarios.length === 0 ? (
          <div className="py-8 text-center text-foreground/70">
            <p>Nenhuma condolência ainda.</p>
            <p className="text-sm mt-2">Seja o primeiro a deixar uma mensagem.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {comentarios.map((comentario) => (
                <div
                  key={comentario.id}
                  className="pb-6 border-b border-muted last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">
                        {comentario.nome || "Anônimo"}
                      </div>
                      <div className="text-sm text-foreground/60">
                        {formatarData(comentario.criadoEm)}
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground/80 whitespace-pre-wrap">
                    {comentario.texto}
                  </p>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (paginaAtual > 1) {
                      setPaginaAtual(paginaAtual - 1)
                    }
                  }}
                  disabled={paginaAtual === 1}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                    (pagina) => (
                      <Button
                        key={pagina}
                        variant={pagina === paginaAtual ? "outline" : "ghost"}
                        size="icon"
                        onClick={() => {
                          setPaginaAtual(pagina)
                        }}
                        className="h-9 w-9"
                      >
                        {pagina}
                      </Button>
                    )
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (paginaAtual < totalPaginas) {
                      setPaginaAtual(paginaAtual + 1)
                    }
                  }}
                  disabled={paginaAtual === totalPaginas}
                  className="h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Formulário de Comentário */}
        <div className="mt-8 pt-8 border-t border-muted">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Deixe sua condolência
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Seu nome (opcional)"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div>
              <Textarea
                placeholder="Escreva sua mensagem de condolência..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            {erro && (
              <div className="text-sm text-destructive">{erro}</div>
            )}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !texto.trim()}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Publicando..." : "Publicar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

