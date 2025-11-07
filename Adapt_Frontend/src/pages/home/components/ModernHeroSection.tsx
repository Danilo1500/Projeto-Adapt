import { Button } from "./ui/button";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ModernHeroSection() {
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4600ff]/5 via-purple-50 to-white" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#4600ff]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#4600ff]/10 text-[#4600ff] px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="size-4" />
              <span className="text-sm font-semibold">Plataforma #1 para Profissionais de TI</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Crie o seu{" "}
              <span className="text-[#4600ff] relative">
                futuro
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C50 2 150 2 198 10"
                    stroke="#4600ff"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              na tecnologia
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Conecte-se com as melhores oportunidades de carreira em TI. Empresas inovadoras 
              estão procurando por talentos como você.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#4600ff] hover:bg-[#3800cc] text-white rounded-full px-8 gap-2 shadow-lg shadow-[#4600ff]/25">
                Começar Agora
                <ArrowRight className="size-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-[#4600ff] text-[#4600ff] hover:bg-[#4600ff] hover:text-white rounded-full px-8">
                Sou Empresa
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-3xl font-black text-[#4600ff]">500+</p>
                  <TrendingUp className="size-5 text-[#4600ff]" />
                </div>
                <p className="text-sm text-gray-600">Empresas Cadastradas</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-3xl font-black text-[#4600ff]">10k+</p>
                  <TrendingUp className="size-5 text-[#4600ff]" />
                </div>
                <p className="text-sm text-gray-600">Profissionais Ativos</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-3xl font-black text-[#4600ff]">95%</p>
                  <TrendingUp className="size-5 text-[#4600ff]" />
                </div>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1755541516450-644adb257ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTI1MjI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional workspace"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4600ff]/20 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-500 text-white size-12 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nova contratação</p>
                  <p className="font-bold text-gray-900">João Silva - Dev Full Stack</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
