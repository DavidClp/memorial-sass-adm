"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { api, type Memorial } from "@/lib/api"
import { Trash2, Edit2, LinkIcon } from "lucide-react"

interface MemorialListProps {
  onEdit: (memorial: Memorial) => void
  refreshTrigger: number
}

export function MemorialList({ onEdit, refreshTrigger }: MemorialListProps) {
  const [memoriais, setMemoriais] = useState<Memorial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadMemoriais = async () => {
    try {
      const data = await api.getMemoriais()
      setMemoriais(data)
    } catch (err) {
      console.error("Erro ao carregar memoriais:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMemoriais()
  }, [refreshTrigger])

  const handleDelete = async (slug: string) => {
    if (confirm("Tem certeza que deseja deletar este memorial?")) {
      try {
        await api.deleteMemorial(slug)
        loadMemoriais()
      } catch (err) {
        console.error("Erro ao deletar:", err)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-foreground/70">Carregando memoriais...</p>
      </div>
    )
  }

  if (memoriais.length === 0) {
    return (
      <div className="text-center py-12 bg-muted rounded-lg">
        <p className="text-foreground/70 mb-4">Nenhum memorial criado ainda.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {memoriais.map((memorial) => (
        <Card key={memorial.id} className="p-6 bg-background border-muted hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-serif font-bold text-foreground mb-1">{memorial.nome}</h3>
              <p className="text-sm text-foreground/60 truncate mb-2">/memorial/{memorial.slug}</p>
              <p className="text-sm text-foreground/70 line-clamp-2">{memorial.biografia}</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <a href={`/memorial/${memorial.slug}`} target="_blank" rel="noopener noreferrer" title="Ver memorial">
                <Button variant="outline" size="sm" className="flex-1 md:flex-initial bg-transparent">
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </a>
              <Button variant="outline" size="sm" onClick={() => onEdit(memorial)} className="flex-1 md:flex-initial">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(memorial.slug)}
                className="flex-1 md:flex-initial text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
