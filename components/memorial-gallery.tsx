"use client"

import { useState, useMemo } from "react"
import { X, Play } from "lucide-react"
import Image from "next/image"

interface MemorialGalleryProps {
  fotos: string[]
  videos?: string[]
  nome: string
}

type MediaItem = {
  url: string
  type: 'photo' | 'video'
  index: number
}

export function MemorialGallery({ fotos, videos = [], nome }: MemorialGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Combinar fotos e vídeos em uma única lista
  const mediaItems: MediaItem[] = useMemo(() => {
    const items: MediaItem[] = []

    fotos.forEach((url, idx) => {
      items.push({ url, type: 'photo', index: idx })
    })

    videos.forEach((url, idx) => {
      items.push({ url, type: 'video', index: idx })
    })

    return items
  }, [fotos, videos])

  if (mediaItems.length === 0) {
    return null
  }

  const selectedItem = selectedIndex !== null ? mediaItems[selectedIndex] : null

  return (
    <>
      <section className="py-0">
        {/*       <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">Galeria de Memórias</h2> */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1">
          {mediaItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="group cursor-pointer relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {item.type === 'photo' ? (
                <Image
                  width={100}
                  height={150}
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  src={item.url || "/placeholder.svg"}
                  alt={`${nome} - Memória ${idx + 1}`}
                  className="w-full aspect-[3.3/5] object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="relative w-full h-64 bg-black/50">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-black fill-black ml-1" />
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            </div>
          ))}
        </div>
      </section>
      {selectedIndex !== null && selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
           {/* Botões laterais */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex((prev) =>
                  prev !== null ? (prev > 0 ? prev - 1 : mediaItems.length - 1) : 0
                )
              }}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white p-3 rounded-full z-20 shadow-lg transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex((prev) =>
                  prev !== null ? (prev < mediaItems.length - 1 ? prev + 1 : 0) : 0
                )
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white p-3 rounded-full z-20 shadow-lg transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>


          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 z-20 hover:bg-white/90 transition shadow-lg"
            >
              <X className="w-6 h-6 text-black" />
            </button>

           
          

            {/* Container da mídia */}
            <div className="flex-1 flex items-center justify-center">
              {selectedItem.type === 'photo' ? (
                <img
                  src={selectedItem.url || "/placeholder.svg"}
                  alt={`${nome} - Memória ${selectedIndex + 1}`}
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg"
                />
              )}
            </div>

            {/* Navegação */}
            <div className="flex justify-center gap-2 mt-4">
              {mediaItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-3 h-3 rounded-full transition ${idx === selectedIndex ? "bg-white" : "bg-white/40"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </>
  )
}
