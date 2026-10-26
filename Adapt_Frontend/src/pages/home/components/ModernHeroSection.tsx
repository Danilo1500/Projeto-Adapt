import { Button } from "./ui/button";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  MessageSquare,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function ModernHeroSection() {
  const navigate = useNavigate();

  const matches = [
    { name: "Dev Front-end", score: "96%", detail: "React, UI, produto" },
    { name: "Analista Cloud", score: "91%", detail: "AWS, automação, segurança" },
    { name: "UX Researcher", score: "88%", detail: "Pesquisa, acessibilidade" },
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-[#f7f9fc] pt-32 pb-14 lg:pb-20">
      <div className="absolute inset-x-0 top-0 h-40 bg-white" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4600ff]/20 bg-white px-4 py-2 text-sm font-semibold text-[#4600ff] shadow-sm">
              <Sparkles className="size-4" />
              Rede de talentos e vagas para tecnologia
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-tight text-gray-950 md:text-6xl lg:text-7xl">
              Encontre o match certo entre talento e oportunidade.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
              O ADAPT aproxima profissionais de TI, empresas e recrutadores em um ambiente com perfil, vagas, conexões e conversas no mesmo fluxo.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("/")}
                className="h-12 rounded-full bg-[#4600ff] px-8 text-white shadow-lg shadow-[#4600ff]/20 hover:bg-[#3800cc]"
              >
                Criar meu perfil
                <ArrowRight className="size-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/")}
                className="h-12 rounded-full border-2 border-gray-300 px-8 text-gray-800 hover:border-[#4600ff] hover:bg-white hover:text-[#4600ff]"
              >
                Publicar uma vaga
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-200 pt-8">
              {[
                ["Perfis", "com portfólio e skills"],
                ["Vagas", "filtradas por aderência"],
                ["Chat", "direto com empresas"],
              ].map(([title, detail]) => (
                <div key={title}>
                  <p className="text-lg font-black text-gray-950">{title}</p>
                  <p className="mt-1 text-sm leading-snug text-gray-500">{detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl shadow-gray-900/10">
              <div className="rounded-3xl bg-gray-950 p-5 text-white">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Painel ADAPT</p>
                    <p className="text-2xl font-black">Matches de hoje</p>
                  </div>
                  <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-300">
                    Online
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <Search className="size-5" />, label: "Busca", value: "124" },
                    { icon: <UsersRound className="size-5" />, label: "Talentos", value: "38" },
                    { icon: <BriefcaseBusiness className="size-5" />, label: "Vagas", value: "17" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl bg-white/10 p-4">
                      <div className="mb-4 text-[#8cffc1]">{item.icon}</div>
                      <p className="text-2xl font-black">{item.value}</p>
                      <p className="text-sm text-white/55">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  {matches.map((match) => (
                    <div key={match.name} className="flex items-center justify-between rounded-2xl bg-white p-4 text-gray-950">
                      <div>
                        <p className="font-bold">{match.name}</p>
                        <p className="text-sm text-gray-500">{match.detail}</p>
                      </div>
                      <div className="rounded-full bg-[#4600ff]/10 px-3 py-1 text-sm font-black text-[#4600ff]">
                        {match.score}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#4600ff] p-4">
                  <MessageSquare className="size-6" />
                  <div>
                    <p className="font-bold">Conversa iniciada</p>
                    <p className="text-sm text-white/75">Empresa e candidato alinhando próximos passos.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-900/10 sm:-left-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-8 text-emerald-500" />
                <div>
                  <p className="text-sm text-gray-500">Match recomendado</p>
                  <p className="font-black text-gray-950">Full Stack Pleno</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
