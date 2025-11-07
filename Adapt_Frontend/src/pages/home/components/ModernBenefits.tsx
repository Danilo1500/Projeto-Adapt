import { motion } from "framer-motion";
import { Zap, Target, Shield, Rocket, Users, BarChart } from "lucide-react";

export function ModernBenefits() {
  const benefits = [
    {
      icon: <Zap className="size-6" />,
      title: "Contratação Ágil",
      description: "Processos simplificados que economizam tempo e recursos",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: <Target className="size-6" />,
      title: "Match Perfeito",
      description: "Algoritmo inteligente conecta empresas e profissionais ideais",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: <Shield className="size-6" />,
      title: "Segurança e Confiança",
      description: "Verificação de perfis e avaliações transparentes",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: <Rocket className="size-6" />,
      title: "Crescimento Acelerado",
      description: "Oportunidades que impulsionam sua carreira",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: <Users className="size-6" />,
      title: "Rede Qualificada",
      description: "Conecte-se com os melhores talentos e empresas",
      color: "from-red-400 to-rose-500",
    },
    {
      icon: <BarChart className="size-6" />,
      title: "Dados e Insights",
      description: "Analytics para tomar decisões mais inteligentes",
      color: "from-indigo-400 to-purple-500",
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Por que escolher o <span className="text-[#4600ff]">ADAPT</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Uma plataforma completa que transforma a forma como empresas e profissionais se conectam
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${benefit.color} size-14 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
              
              {/* Hover effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
