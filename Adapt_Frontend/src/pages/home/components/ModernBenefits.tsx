import { motion } from "framer-motion";
import { BarChart3, Bot, MessagesSquare, ShieldCheck, SlidersHorizontal, UserRoundCheck } from "lucide-react";

export function ModernBenefits() {
  const benefits = [
    {
      icon: <UserRoundCheck className="size-6" />,
      title: "Perfil que mostra potencial",
      description: "Skills, experiências, posts e conexões ajudam candidatos a contar melhor sua trajetória.",
      tone: "bg-[#4600ff] text-white",
    },
    {
      icon: <Bot className="size-6" />,
      title: "Match com mais contexto",
      description: "A IA cruza requisitos de vaga com habilidades, senioridade e preferências do profissional.",
      tone: "bg-emerald-500 text-white",
    },
    {
      icon: <MessagesSquare className="size-6" />,
      title: "Conversas no fluxo",
      description: "Recrutadores e candidatos seguem a conversa dentro da plataforma, sem perder histórico.",
      tone: "bg-gray-950 text-white",
    },
    {
      icon: <SlidersHorizontal className="size-6" />,
      title: "Busca precisa",
      description: "Filtros por área, senioridade e habilidades deixam a descoberta mais rápida para os dois lados.",
      tone: "bg-cyan-500 text-white",
    },
    {
      icon: <ShieldCheck className="size-6" />,
      title: "Ambiente confiável",
      description: "Perfis, empresas e interações organizadas em uma rede profissional dedicada à tecnologia.",
      tone: "bg-amber-500 text-white",
    },
    {
      icon: <BarChart3 className="size-6" />,
      title: "Decisões mais claras",
      description: "Empresas acompanham aderência e candidatos entendem onde têm mais chance de avançar.",
      tone: "bg-rose-500 text-white",
    },
  ];

  return (
    <section id="benefits" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-3 text-sm font-black uppercase text-[#4600ff]">Benefícios</p>
          <h2 className="text-4xl font-black leading-tight text-gray-950 md:text-5xl">
            Uma rede profissional feita para acelerar contratações em tecnologia.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            O ADAPT junta presença profissional, descoberta de vagas e relacionamento em um produto simples de usar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-gray-900/10"
            >
              <div className={`mb-6 flex size-12 items-center justify-center rounded-xl ${benefit.tone}`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-black text-gray-950">{benefit.title}</h3>
              <p className="mt-3 leading-relaxed text-gray-600">{benefit.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
