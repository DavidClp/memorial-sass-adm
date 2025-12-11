"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import { api, type Memorial } from "@/lib/api"
import { MemorialGallery } from "@/components/memorial-gallery"
import { MemorialComments } from "@/components/memorial-comments"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MemorialPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [memorial, setMemorial] = useState<Memorial | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadMemorial = async () => {
      try {
        const data = await api.getMemorialBySlug(slug)
        setMemorial(data)
      } catch (err) {
        setError("Memorial não encontrado")
      } finally {
        setIsLoading(false)
      }
    }

    loadMemorial()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/70">Carregando memorial...</p>
        </div>
      </div>
    )
  }

  if (error || !memorial) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">{error}</h1>
          <Button onClick={() => router.push("/")} variant="outline">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  const backgroundColor = memorial.corPrincipal + "15" // Add transparency

  return (
    <div className="min-h-screen" style={{ backgroundColor }}>
      <header className="sticky top-0 z-40 bg-background/95 border-b border-muted">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button onClick={() => router.push("/")} variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="rounded-lg overflow-hidden shadow-lg mb-8">
            <img
              src={memorial.fotoMainUrl || "/placeholder.svg"}
              alt={memorial.nome}
              className="memorial-main-photo w-full h-96 object-cover"
            />
            <div className="p-8 text-foreground relative bg-muted" /* style={{ backgroundColor: memorial.corPrincipal }} */>
              <h1 className="text-4xl md:text-5xl text-center font-serif font-bold mb-6">{memorial.nome}</h1>
              <div className="text-xl text-foreground/80 mb-6 flex flex-col items-center  gap-2">
                {memorial.dataNascimento && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">
                      {/* Ícone nascimento */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 2l2.9 6.9L22 9.8l-5 5 1.2 7.2L12 18l-6.2 3.9L7 14.8l-5-5 7.1-1z"
                        />
                      </svg>
                    </span>
                    <span>{new Date(memorial.dataNascimento).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' - ')}</span>
                  </div>
                )}

                {memorial.dataMorte && (
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">
                      {/* Ícone falecimento */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-black"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M11 2h2v20h-2zM4 7h16v2H4z" />
                      </svg>
                    </span>
                    <span>{new Date(memorial.dataMorte).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' - ')}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap mt-4">
                <span className="inline-block px-3 py-1 bg-white/60 rounded-full text-sm">Sempre lembrado</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="biografia">
            <TabsList>
              <TabsTrigger value="biografia">Biografia</TabsTrigger>
              <TabsTrigger value="galeriaFotos">Galeria de Memórias</TabsTrigger>
            </TabsList>
            <TabsContent value="biografia" className="pt-4">
              {/* Biografia */}
              <div className="bg-background rounded-lg p-8 shadow-sm border border-muted max-w-full">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Biografia</h2>
                <div className="prose prose-lg max-w-none text-foreground/80 whitespace-pre-wrap">{memorial.biografia}</div>
              </div>
            </TabsContent>
            <TabsContent value="galeriaFotos" className="pt-4">
              {((memorial.galeriaFotos && memorial.galeriaFotos.length > 0) || (memorial.galeriaVideos && memorial.galeriaVideos.length > 0)) && (
                <MemorialGallery
                  fotos={memorial.galeriaFotos || []}
                  videos={memorial.galeriaVideos || []}
                  nome={memorial.nome}
                />
              )}
            </TabsContent>
          </Tabs>
        </section>


        {/* Causa da Morte */}
        {memorial.causaMorte && (
          <section className="mt-6">
            <div className="bg-background rounded-lg p-8 shadow-sm border border-muted">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Causa da Morte</h2>
              <div className="prose prose-lg max-w-none text-foreground/80 whitespace-pre-wrap">{memorial.causaMorte}</div>
            </div>
          </section>
        )}

        {/* Comentários */}
        <MemorialComments memorialSlug={slug} />

        {/* Footer Section */}
        <section className="mt-12 pt-12 border-t border-muted text-center">
          <p className="text-foreground/60 mb-4">Este memorial foi criado em honra a {memorial.nome}.</p>
          <p className="text-sm text-foreground/50">Compartilhe estas memórias com quem você ama.</p>
        </section>
      </main>
    </div>
  )
}
