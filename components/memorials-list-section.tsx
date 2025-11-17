"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api, type Memorial } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart } from "lucide-react"

export function MemorialsListSection() {
  const [memoriais, setMemoriais] = useState<Memorial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemoriais = async () => {
      try {
        const data = await api.getMemoriais()
        setMemoriais(data)
      } catch (error) {
        console.error("Erro ao carregar memoriais:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMemoriais()
  }, [])

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Memoriais em Destaque</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Conheça as histórias de vida que já estão preservadas em nosso acervo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="pt-4">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : memoriais.length > 0 ? (
            memoriais.map((memorial) => (
              <Link key={memorial.id} href={`/memorial/${memorial.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full animate-fade-in">
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={memorial.fotoMainUrl || "/placeholder.svg"}
                      alt={memorial.nome}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className="absolute top-0 right-0 w-3 h-3 rounded-full"
                      style={{ backgroundColor: memorial.corPrincipal }}
                    />
                  </div>

                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">{memorial.nome}</h3>
                      <Heart className="w-5 h-5 flex-shrink-0 text-muted-foreground/40" />
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{memorial.biografia}</p>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {memorial.galeriaFotos.length} fotos
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum memorial registrado ainda. Seja o primeiro a criar um!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
