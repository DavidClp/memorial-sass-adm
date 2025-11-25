"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { api, type Memorial } from "@/lib/api"
import { AlertCircle, X, Upload } from "lucide-react"

interface MemorialFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialData?: Memorial
}

export function MemorialForm({ onSuccess, onCancel, initialData }: MemorialFormProps) {
  const [nome, setNome] = useState("")
  const [biografia, setBiografia] = useState("")
  const [slug, setSlug] = useState("")
  const [corPrincipal, setCorPrincipal] = useState("#9b8b8b")
  const [fotoMainFile, setFotoMainFile] = useState<File | null>(null)
  const [fotoMainPreview, setFotoMainPreview] = useState("")
  const [galeriaFotos, setGaleriaFotos] = useState<{ file?: File; url: string }[]>([])
  const [galeriaVideos, setGaleriaVideos] = useState<{ file?: File; url: string }[]>([])
  const [dataNascimento, setDataNascimento] = useState<string>("")
  const [dataMorte, setDataMorte] = useState<string>("")
  const [causaMorte, setCausaMorte] = useState<string>("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome)
      setBiografia(initialData.biografia)
      setSlug(initialData.slug)
      setCorPrincipal(initialData.corPrincipal)
      setFotoMainPreview(initialData.fotoMainUrl)
      setGaleriaFotos(initialData.galeriaFotos.map((url) => ({ url })))
      setGaleriaVideos((initialData.galeriaVideos || []).map((url) => ({ url })))
      // Converter datas do formato ISO para YYYY-MM-DD (formato do input date)
      if (initialData.dataNascimento) {
        const date = new Date(initialData.dataNascimento)
        setDataNascimento(date.toISOString().split('T')[0])
      } else {
        setDataNascimento("")
      }
      if (initialData.dataMorte) {
        const date = new Date(initialData.dataMorte)
        setDataMorte(date.toISOString().split('T')[0])
      } else {
        setDataMorte("")
      }
      setCausaMorte(initialData.causaMorte || "")
    }
  }, [initialData])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD') // Normaliza caracteres acentuados (ex: "ã" vira "a" + "~")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos (acentos, cedilhas, etc)
      .replace(/\s+/g, "_")
      .replace(/[^\w_]/g, "")
  }

  const handleNomeChange = (value: string) => {
    setNome(value)
    if (!initialData) {
      setSlug(generateSlug(value))
    }
  }

  const handleFotoMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setFotoMainFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoMainPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError("")
    } else if (file) {
      setError("Por favor, selecione um arquivo de imagem válido")
    }
  }

  const handleAddGaleriaFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setGaleriaFotos((prev) => [...prev, { file, url: reader.result as string }])
          }
          reader.readAsDataURL(file)
        }
      })
      setError("")
    }
  }

  const handleRemoveFoto = (index: number) => {
    setGaleriaFotos(galeriaFotos.filter((_, i) => i !== index))
  }

  const handleAddGaleriaVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const MAX_SIZE = 50 * 1024 * 1024 // 50MB
      const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
      const errors: string[] = []
      
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("video/")) {
          if (!allowedTypes.includes(file.type)) {
            errors.push(`Tipo de vídeo não permitido: ${file.name}. Tipos permitidos: ${allowedTypes.join(', ')}`)
            return
          }
          if (file.size > MAX_SIZE) {
            errors.push(`Vídeo muito grande: ${file.name}. Tamanho máximo: ${MAX_SIZE / (1024 * 1024)}MB`)
            return
          }
          const reader = new FileReader()
          reader.onloadend = () => {
            setGaleriaVideos((prev) => [...prev, { file, url: reader.result as string }])
          }
          reader.onerror = () => {
            errors.push(`Erro ao processar vídeo: ${file.name}`)
          }
          reader.readAsDataURL(file)
        } else if (file) {
          errors.push(`Arquivo não é um vídeo: ${file.name}`)
        }
      })
      
      if (errors.length > 0) {
        setError(errors.join('; '))
      } else {
        setError("")
      }
    }
  }

  const handleRemoveVideo = (index: number) => {
    setGaleriaVideos(galeriaVideos.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const fotoMainUrl = fotoMainFile ? await api.processImage(fotoMainFile) : fotoMainPreview

      const galeriaFotosProcessed = await Promise.all(
        galeriaFotos.map(async (foto) => {
          if (foto.file) {
            return await api.processImage(foto.file)
          }
          return foto.url
        }),
      )

      const galeriaVideosProcessed = await Promise.all(
        galeriaVideos.map(async (video) => {
          if (video.file) {
            return await api.processVideo(video.file)
          }
          return video.url
        }),
      )

      const data = {
        nome,
        biografia,
        slug,
        corPrincipal,
        fotoMainUrl,
        galeriaFotos: galeriaFotosProcessed,
        galeriaVideos: galeriaVideosProcessed,
        // Enviar datas como strings no formato YYYY-MM-DD
        dataNascimento: dataNascimento || null,
        dataMorte: dataMorte || null,
        causaMorte: causaMorte || null,
      }

      if (initialData) {
        await api.updateMemorial(initialData.slug, data)
      } else {
        await api.createMemorial(data as any)
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || "Erro ao salvar memorial")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8 bg-background border-muted max-w-2xl mx-auto">
      <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
        {initialData ? "Editar Memorial" : "Criar Novo Memorial"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nome da Pessoa *</label>
          <Input
            type="text"
            value={nome}
            onChange={(e) => handleNomeChange(e.target.value)}
            placeholder="Ex: José Silva"
            disabled={isLoading}
            required
            className="bg-white border-muted"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Slug (URL) *</label>
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ex: jose_silva"
            disabled={isLoading || !!initialData}
            required
            className="bg-white border-muted"
          />
          <p className="text-xs text-foreground/50 mt-1">Será usado na URL: /memorial/{slug}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Biografia *</label>
          <textarea
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            placeholder="Escreva a história e memórias dessa pessoa..."
            disabled={isLoading}
            required
            rows={5}
            className="w-full px-3 py-2 border border-muted rounded-md bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data de Nascimento</label>
            <Input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              disabled={isLoading}
              className="bg-white border-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data da Morte</label>
            <Input
              type="date"
              value={dataMorte}
              onChange={(e) => setDataMorte(e.target.value)}
              disabled={isLoading}
              className="bg-white border-muted"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Causa da Morte</label>
          <textarea
            value={causaMorte}
            onChange={(e) => setCausaMorte(e.target.value)}
            placeholder="Descreva a causa da morte..."
            disabled={isLoading}
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 border border-muted rounded-md bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

      {/*   <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Cor Principal (Hex) *</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={corPrincipal}
                onChange={(e) => setCorPrincipal(e.target.value)}
                disabled={isLoading}
                className="h-12 w-20 rounded cursor-pointer"
              />
              <Input
                type="text"
                value={corPrincipal}
                onChange={(e) => setCorPrincipal(e.target.value)}
                placeholder="#9b8b8b"
                disabled={isLoading}
                className="bg-white border-muted flex-1"
              />
            </div>
          </div>
        </div>
 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Foto Principal *</label>
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-2 border-dashed border-muted rounded-lg p-4 cursor-pointer hover:border-primary/50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoMainChange}
                disabled={isLoading}
                className="hidden"
                id="foto-main-input"
                required={!initialData && !fotoMainFile}
              />
              <label
                htmlFor="foto-main-input"
                className="flex-1 flex items-center gap-2 cursor-pointer text-sm text-foreground/60"
              >
                <Upload className="w-5 h-5" />
                {fotoMainFile ? fotoMainFile.name : "Clique para selecionar ou arraste a foto"}
              </label>
            </div>
            {fotoMainPreview && (
              <img
                src={fotoMainPreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Galeria de Fotos</label>
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-2 border-dashed border-muted rounded-lg p-4 cursor-pointer hover:border-primary/50 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddGaleriaFoto}
                disabled={isLoading}
                className="hidden"
                id="galeria-input"
              />
              <label
                htmlFor="galeria-input"
                className="flex-1 flex items-center gap-2 cursor-pointer text-sm text-foreground/60"
              >
                <Upload className="w-5 h-5" />
                Clique para selecionar múltiplas fotos
              </label>
            </div>

            {galeriaFotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {galeriaFotos.map((foto, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={foto.url || "/placeholder.svg"}
                      alt={`Galeria ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFoto(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Galeria de Vídeos</label>
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-2 border-dashed border-muted rounded-lg p-4 cursor-pointer hover:border-primary/50 transition">
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                multiple
                onChange={handleAddGaleriaVideo}
                disabled={isLoading}
                className="hidden"
                id="galeria-video-input"
              />
              <label
                htmlFor="galeria-video-input"
                className="flex-1 flex items-center gap-2 cursor-pointer text-sm text-foreground/60"
              >
                <Upload className="w-5 h-5" />
                Clique para selecionar múltiplos vídeos (máx. 50MB cada)
              </label>
            </div>

            {galeriaVideos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {galeriaVideos.map((video, idx) => (
                  <div key={idx} className="relative group">
                    <video
                      src={video.url}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-primary/90 text-white py-3">
            {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar Memorial"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={isLoading}
            className="flex-1 bg-transparent"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
