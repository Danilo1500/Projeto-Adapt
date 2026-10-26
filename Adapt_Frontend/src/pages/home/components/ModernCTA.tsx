import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ModernCTA() {
  const navigate = useNavigate();

  const points = ["Cadastro simples", "Perfil profissional", "Vagas e conexões em um só lugar"];

  return (
    <section className="bg-gray-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-3 text-sm font-black uppercase text-[#8cffc1]">Comece agora</p>
            <h2 className="max-w-3xl text-4xl font-black leading-tight md:text-5xl">
              Transforme sua rede profissional em novas oportunidades.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
              Entre no ADAPT para criar seu perfil, encontrar vagas de tecnologia e conversar com empresas que procuram talentos como você.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="space-y-4">
              {points.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-[#8cffc1]" />
                  <span className="text-white/85">{point}</span>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="mt-8 h-12 w-full rounded-full bg-white px-8 text-[#4600ff] hover:bg-gray-100"
            >
              Acessar o ADAPT
              <ArrowRight className="size-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
