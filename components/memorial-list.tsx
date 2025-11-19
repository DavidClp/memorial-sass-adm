"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api, type Memorial } from "@/lib/api"
import { Trash2, Edit2, LinkIcon, QrCode, Download } from "lucide-react"
import QRCode from "qrcode"

interface MemorialListProps {
  onEdit: (memorial: Memorial) => void
  refreshTrigger: number
}

export function MemorialList({ onEdit, refreshTrigger }: MemorialListProps) {
  const [memoriais, setMemoriais] = useState<Memorial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMemorial, setSelectedMemorial] = useState<Memorial | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

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

  const handleGenerateQRCode = async (memorial: Memorial) => {
    setSelectedMemorial(memorial)
    const memorialUrl = `${window.location.origin}/memorial/${memorial.slug}`
    
    try {
      const qrDataUrl = await QRCode.toDataURL(memorialUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
      setQrCodeUrl(qrDataUrl)
    } catch (err) {
      console.error("Erro ao gerar QR code:", err)
    }
  }

  const handleDownloadQRCode = () => {
    if (!qrCodeUrl || !selectedMemorial) return

    const link = document.createElement("a")
    link.download = `qr-code-${selectedMemorial.slug}.png`
    link.href = qrCodeUrl
    link.click()
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleGenerateQRCode(memorial)} 
                className="flex-1 md:flex-initial"
                title="Gerar QR Code"
              >
                <QrCode className="w-4 h-4" />
              </Button>

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

      <Dialog open={!!selectedMemorial} onOpenChange={(open) => !open && setSelectedMemorial(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code do Memorial</DialogTitle>
            <DialogDescription>
              Escaneie o QR code para acessar o memorial de {selectedMemorial?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {qrCodeUrl && (
              <>
                <div className="bg-white p-4 rounded-lg">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="text-sm text-muted-foreground text-center break-all px-4">
                  {window.location.origin}/memorial/{selectedMemorial?.slug}
                </div>
                <Button 
                  onClick={handleDownloadQRCode}
                  className="w-full"
                  variant="default"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar QR Code
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
