"use client"

import { Heart, ImageIcon, Share2 } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: Heart,
      title: "Personalize a página",
      description: "com cores, fotos e biografia.",
    },
    {
      icon: ImageIcon,
      title: "Crie galerias",
      description: "de memórias inesquecíveis.",
    },
    {
      icon: Share2,
      title: "Compartilhe",
      description: "com amigos e familiares.",
    },
  ]

  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-center text-foreground mb-16">
          Por que escolher Memorizando?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div
                key={idx}
                className="bg-background p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <Icon className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-foreground/70">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
