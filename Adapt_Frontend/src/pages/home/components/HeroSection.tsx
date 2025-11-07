import { Button } from "./ui/button";
import { ArrowRight, Search } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-950/20 dark:to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-sm">+500 profissionais disponíveis</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-foreground via-purple-800 dark:via-purple-400 to-foreground bg-clip-text text-transparent">
                Encontre os melhores profissionais de TI
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Conecte-se com desenvolvedores, designers e especialistas em tecnologia 
                qualificados para transformar suas ideias em realidade.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 group">
                Começar Agora
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Buscar Profissionais
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">Profissionais</div>
              </div>
              <div>
                <div className="text-3xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  1.2k+
                </div>
                <div className="text-sm text-muted-foreground">Projetos</div>
              </div>
              <div>
                <div className="text-3xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  98%
                </div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-600/20 blur-3xl opacity-30"></div>
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1660810731526-0720827cbd38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTk5MjQyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Profissional de TI trabalhando"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
