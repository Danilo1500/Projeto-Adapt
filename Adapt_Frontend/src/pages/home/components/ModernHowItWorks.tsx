import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, FileText, MessageCircle, Search } from "lucide-react";

export function ModernHowItWorks() {
  const steps = [
    {
      icon: <FileText className="size-6" />,
      title: "Monte seu perfil",
      description: "Organize experiências, habilidades e interesses para ser encontrado com mais precisão.",
    },
    {
      icon: <Search className="size-6" />,
      title: "Descubra vagas",
      description: "Veja oportunidades alinhadas ao seu momento profissional e às tecnologias que você domina.",
    },
    {
      icon: <MessageCircle className="size-6" />,
      title: "Converse com empresas",
      description: "Tire dúvidas, avance no processo e mantenha o contato em um único lugar.",
    },
    {
      icon: <Briefcase className="size-6" />,
      title: "Feche o próximo passo",
      description: "Transforme conexões qualificadas em entrevistas, propostas e novas contratações.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#f7f9fc] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-3 text-sm font-black uppercase text-[#4600ff]">Como funciona</p>
            <h2 className="text-4xl font-black leading-tight text-gray-950 md:text-5xl">
              Do cadastro ao contato, tudo gira em torno de aderência.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Candidatos ganham clareza sobre onde se encaixam. Empresas reduzem ruído e chegam mais rápido em pessoas com contexto.
            </p>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 size-7 text-emerald-500" />
                <div>
                  <p className="font-black text-gray-950">Fluxo integrado</p>
                  <p className="mt-1 text-gray-600">
                    Perfil, descoberta, conexão, mensagem e vaga conversam entre si dentro do ADAPT.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#4600ff] text-white">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-gray-100">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-black text-gray-950">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600">{step.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
