import { Code, Palette, Database, Smartphone, Cloud, Shield } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const categories = [
  {
    icon: Code,
    title: "Desenvolvedores Full Stack",
    count: "150+",
    skills: ["React", "Node.js", "TypeScript"]
  },
  {
    icon: Smartphone,
    title: "Desenvolvedores Mobile",
    count: "80+",
    skills: ["React Native", "Flutter", "Swift"]
  },
  {
    icon: Palette,
    title: "UI/UX Designers",
    count: "90+",
    skills: ["Figma", "Adobe XD", "Sketch"]
  },
  {
    icon: Database,
    title: "Engenheiros de Dados",
    count: "60+",
    skills: ["SQL", "Python", "MongoDB"]
  },
  {
    icon: Cloud,
    title: "DevOps Engineers",
    count: "50+",
    skills: ["AWS", "Docker", "Kubernetes"]
  },
  {
    icon: Shield,
    title: "Especialistas em Segurança",
    count: "40+",
    skills: ["Pentesting", "Security", "Compliance"]
  }
];

export function ProfessionalCategories() {
  return (
    <section id="profissionais" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl">Categorias de Profissionais</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre especialistas em diversas áreas da tecnologia, 
            prontos para impulsionar seu projeto.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-primary-foreground group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {category.count}
                    </span>
                  </div>
                  <h3>{category.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 text-xs rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">
            Ver Todas as Categorias
          </Button>
        </div>
      </div>
    </section>
  );
}
