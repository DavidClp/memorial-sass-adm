"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface MemorialGalleryProps {
  fotos: string[]
  nome: string
}

export function MemorialGallery({ fotos, nome }: MemorialGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (fotos.length === 0) {
    return null
  }

  return (
    <>
      <section className="py-0">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">Galeria de Memórias</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fotos.map((foto, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="group cursor-pointer relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={foto || "/placeholder.svg"}
                alt={`${nome} - Memória ${idx + 1}`}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            </div>
          ))}
        </div>
      </section>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 z-10"
            >
              <X className="w-6 h-6 text-black" />
            </button>
            <img
              src={fotos[selectedIndex] || "/placeholder.svg"}
              alt={`${nome} - Memória ${selectedIndex + 1}`}
              className="w-full rounded-lg"
            />
            <div className="flex justify-center gap-2 mt-4">
              {fotos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-3 h-3 rounded-full transition ${idx === selectedIndex ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
