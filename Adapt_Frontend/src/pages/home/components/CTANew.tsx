import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTANew() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-purple-200">Comece hoje mesmo</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Pronto para dar o próximo passo na sua carreira?
            </h2>

            {/* Description */}
            <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
              Junte-se a milhares de profissionais e empresas que já encontraram 
              seu match perfeito no Adapt TI
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button 
                size="lg"
                className="bg-white text-purple-900 hover:bg-purple-50 px-8 rounded-full shadow-lg hover:shadow-white/20 transition-all group"
              >
                Criar conta grátis
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 rounded-full backdrop-blur-sm"
              >
                Falar com especialista
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
            >
              <div className="border-l border-white/20 pl-6">
                <div className="text-3xl lg:text-4xl font-bold text-white">500+</div>
                <div className="text-sm text-purple-200 mt-1">Empresas cadastradas</div>
              </div>
              <div className="border-l border-white/20 pl-6">
                <div className="text-3xl lg:text-4xl font-bold text-white">2.5k+</div>
                <div className="text-sm text-purple-200 mt-1">Profissionais ativos</div>
              </div>
              <div className="border-l border-white/20 pl-6">
                <div className="text-3xl lg:text-4xl font-bold text-white">1.2k+</div>
                <div className="text-sm text-purple-200 mt-1">Contratações realizadas</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
