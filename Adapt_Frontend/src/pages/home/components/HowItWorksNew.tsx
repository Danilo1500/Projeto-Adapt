import { motion } from "framer-motion";
import { UserPlus, Search, MessageSquare, Briefcase } from "lucide-react";
import { Card } from "./ui/card";

export function HowItWorksNew() {
  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: "Crie seu perfil",
      description: "Cadastre-se gratuitamente e complete seu perfil profissional com suas habilidades e experiências"
    },
    {
      icon: Search,
      number: "02",
      title: "Encontre oportunidades",
      description: "Navegue por milhares de vagas ou deixe que empresas encontrem você através do nosso sistema de matching"
    },
    {
      icon: MessageSquare,
      number: "03",
      title: "Conecte-se",
      description: "Entre em contato direto com empresas ou receba propostas de recrutadores interessados no seu perfil"
    },
    {
      icon: Briefcase,
      number: "04",
      title: "Comece a trabalhar",
      description: "Finalize o processo seletivo e comece sua jornada em uma empresa que combina com seus objetivos"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 bg-purple-100 rounded-full mb-4">
            <span className="text-purple-700 font-semibold">Como funciona</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simples, rápido e eficiente
          </h2>
          <p className="text-gray-600 text-lg">
            Em apenas 4 passos você pode transformar sua carreira
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Number */}
                  <div className="text-6xl font-bold text-purple-100 mb-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector line (not for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-300 to-transparent" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
