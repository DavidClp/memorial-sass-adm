"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-background py-20 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight text-balance">
              Guarde para sempre as memórias de quem você ama.
            </h1>
            <p className="text-lg text-foreground/75 leading-relaxed text-balance">
              Crie uma página personalizada para homenagear pessoas especiais, com fotos, histórias e lembranças que
              perduram no tempo.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/admin">
                <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg">Comece agora</Button>
              </Link>
            </div>
          </div>
          <div className="animate-fade-in delay-200">
            <img
              src="/elderly-man-portrait.png"
              alt="Homenagem"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
