import { Search, UserCheck, Rocket, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";

const steps = [
  {
    icon: Search,
    title: "Busque Profissionais",
    description: "Explore nosso catálogo de desenvolvedores, designers e especialistas em TI qualificados."
  },
  {
    icon: UserCheck,
    title: "Analise Perfis",
    description: "Veja portfólios, avaliações e experiências anteriores dos profissionais."
  },
  {
    icon: CheckCircle,
    title: "Contrate",
    description: "Escolha o profissional ideal e inicie a colaboração de forma simples e segura."
  },
  {
    icon: Rocket,
    title: "Execute seu Projeto",
    description: "Acompanhe o progresso e veja suas ideias ganharem vida com qualidade."
  }
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl">Como Funciona</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Contratar os melhores profissionais de TI nunca foi tão fácil. 
            Siga nosso processo simplificado em 4 passos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative p-6 hover:shadow-lg transition-shadow">
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                  {index + 1}
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3>{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
