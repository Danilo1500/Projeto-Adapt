import { motion } from "framer-motion";
import { UserPlus, Search, MessageSquare, Briefcase } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ModernHowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="size-8" />,
      title: "Crie seu Perfil",
      description: "Cadastre-se gratuitamente e monte um perfil profissional completo com suas habilidades e experiências",
      number: "01",
    },
    {
      icon: <Search className="size-8" />,
      title: "Explore Oportunidades",
      description: "Navegue por milhares de vagas ou deixe que empresas encontrem você através do nosso sistema de match",
      number: "02",
    },
    {
      icon: <MessageSquare className="size-8" />,
      title: "Conecte-se",
      description: "Inicie conversas, participe de processos seletivos e tire todas as suas dúvidas diretamente com empresas",
      number: "03",
    },
    {
      icon: <Briefcase className="size-8" />,
      title: "Seja Contratado",
      description: "Receba propostas, negocie condições e comece a trabalhar na empresa dos seus sonhos",
      number: "04",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#4600ff]/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Como funciona?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            4 passos simples para transformar sua carreira em tecnologia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 group"
              >
                <div className="relative flex-shrink-0">
                  <div className="bg-[#4600ff] text-white size-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white text-[#4600ff] size-8 rounded-full flex items-center justify-center text-xs font-black border-2 border-[#4600ff]">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1634838872223-92ca3d20a927?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMGNvZGluZ3xlbnwxfHx8fDE3NjEyNTIyNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Developer working"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4600ff]/30 to-transparent" />
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#4600ff] rounded-3xl opacity-20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
