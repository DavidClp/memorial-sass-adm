"use client"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Maria Silva",
      text: "Consegui criar um memorial lindo para meu avó. É tão especial poder compartilhar suas memórias com toda a família.",
      relation: "Neta",
    },
    {
      name: "João Santos",
      text: "A plataforma é simples de usar e muito tocante. Meus filhos adoram ver as fotos do avô reunidas em um único lugar.",
      relation: "Pai",
    },
    {
      name: "Ana Oliveira",
      text: "Obrigada por criar um espaço tão especial para honrar quem nos deixou. É reconfortante visitá-lo sempre que sinto saudade.",
      relation: "Amiga",
    },
  ]

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-center text-foreground mb-16">O que as pessoas dizem</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-muted p-8 rounded-lg border border-secondary/30 animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-foreground/75 mb-4 italic">"{testimonial.text}"</p>
              <div className="border-t border-secondary/30 pt-4">
                <p className="font-serif font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-foreground/60">{testimonial.relation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
