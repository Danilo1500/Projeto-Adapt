import { Card } from "./ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const testimonials = [
  {
    name: "Ana Silva",
    role: "CEO, TechStart",
    content: "Encontrei desenvolvedores incríveis para minha startup. A qualidade dos profissionais é excepcional e o processo foi muito simples.",
    rating: 5,
    initials: "AS"
  },
  {
    name: "Carlos Mendes",
    role: "CTO, InnovaSoft",
    content: "A plataforma me ajudou a montar uma equipe completa em menos de 2 semanas. Recomendo fortemente!",
    rating: 5,
    initials: "CM"
  },
  {
    name: "Mariana Costa",
    role: "Product Manager, Digital Plus",
    content: "Excelente experiência! Os profissionais são qualificados e comprometidos. Nosso projeto foi entregue com perfeição.",
    rating: 5,
    initials: "MC"
  }
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl">O que nossos clientes dizem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Veja o que empresas e empreendedores falam sobre nossa plataforma.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 space-y-4">
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div>{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
