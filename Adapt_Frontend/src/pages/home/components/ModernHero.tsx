import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import svgPaths from "../imports/svg-dph6lrz7am";

function AdaptLogo() {
  return (
    <div className="absolute inset-[2.09%_3.15%_-84.31%_-36.48%]" data-name="layer1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 278 412">
        <g id="layer1">
          <path d={svgPaths.p1c82e900} fill="url(#paint0_linear_hero)" id="rect1132" />
          <path d={svgPaths.p17514840} fill="url(#paint1_linear_hero)" id="rect1137" />
          <path d={svgPaths.p2eee5ec0} fill="var(--fill-0, white)" id="path235" />
          <path d={svgPaths.p11181000} fill="var(--fill-0, white)" id="path233" />
          <g id="g18">
            <path d={svgPaths.p8f04e70} fill="var(--fill-0, #000055)" id="path6" />
            <path d={svgPaths.p1ba38780} fill="var(--fill-0, white)" id="path2" />
            <path d={svgPaths.pc4d3b80} fill="var(--fill-0, white)" id="path3" />
            <path d={svgPaths.p1ecc1800} fill="var(--fill-0, #2A2AFF)" id="path4" />
            <path d={svgPaths.p3153d000} fill="var(--fill-0, #5555FF)" id="path5" />
            <path d={svgPaths.p112d8440} fill="var(--fill-0, #8080FF)" id="path7" />
            <path d={svgPaths.p1ace5b80} fill="var(--fill-0, white)" id="path8" />
          </g>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_hero" x1="185.453" x2="185.453" y1="49.6226" y2="197.991">
            <stop />
            <stop offset="1" stopColor="#4600FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_hero" x1="172.501" x2="172.501" y1="68.3283" y2="196.716">
            <stop />
            <stop offset="1" stopColor="#4600FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function ModernHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-black overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-3xl"
      />

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="relative h-14 w-14 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
              <span className="text-[#4600ff] font-['Inter'] font-bold text-xl">TI</span>
            </div>
            <span className="text-white font-['Archivo_Black'] text-3xl">Adapt</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Entrar
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300">Conectando talentos e empresas</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="text-white text-5xl lg:text-7xl font-['Comfortaa'] leading-tight">
                Aqui você cria o seu{" "}
                <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  futuro
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-300 text-xl leading-relaxed"
            >
              Junte-se ao Adapt e consiga o trabalho dos seus sonhos. A plataforma que conecta programadores talentosos com empresas inovadoras.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all group"
              >
                Começar agora
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-purple-500/30 text-white hover:bg-purple-500/10 px-8 rounded-full"
              >
                Saiba mais
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-8 pt-4"
            >
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Empresas</div>
              </div>
              <div className="h-12 w-px bg-gray-700" />
              <div>
                <div className="text-3xl font-bold text-white">2.5k+</div>
                <div className="text-sm text-gray-400">Profissionais</div>
              </div>
              <div className="h-12 w-px bg-gray-700" />
              <div>
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-sm text-gray-400">Satisfação</div>
              </div>
            </motion.div>
          </div>

          {/* Right content - Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[300px] h-[400px]">
                <AdaptLogo />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
