import { motion } from "framer-motion";
import { Building2, Users, Zap, TrendingUp, Shield, Target } from "lucide-react";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function BenefitsSection() {
  const companyBenefits = [
    {
      icon: Zap,
      title: "Economia de tempo",
      description: "Processos de contratação até 70% mais rápidos"
    },
    {
      icon: Target,
      title: "Matching preciso",
      description: "Encontre talentos perfeitamente alinhados"
    },
    {
      icon: Shield,
      title: "Suporte especializado",
      description: "Acompanhamento em todo o processo"
    }
  ];

  const professionalBenefits = [
    {
      icon: TrendingUp,
      title: "Crescimento acelerado",
      description: "Oportunidades que impulsionam sua carreira"
    },
    {
      icon: Target,
      title: "Vagas compatíveis",
      description: "Apenas oportunidades que fazem sentido para você"
    },
    {
      icon: Users,
      title: "Network qualificado",
      description: "Conecte-se com as melhores empresas do mercado"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Benefícios para todos
          </h2>
          <p className="text-gray-600 text-lg">
            Uma plataforma que conecta empresas e profissionais de forma inteligente
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Companies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative rounded-3xl overflow-hidden h-64 mb-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZSUyMHBhcnRuZXJzaGlwfGVufDF8fHx8MTc1OTkxNDcyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Business partnership"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Para Empresas</h3>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-gradient-to-br from-purple-600 to-violet-600 border-0 text-white">
              <p className="text-lg leading-relaxed">
                O Adapt agiliza a contratação de profissionais especializados, conectando 
                empresas a talentos alinhados tecnicamente e culturalmente.
              </p>
            </Card>

            <div className="space-y-4">
              {companyBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* For Professionals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="relative rounded-3xl overflow-hidden h-64 mb-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758518729685-f88df7890776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtZWV0aW5nJTIwdGVhbXxlbnwxfHx8fDE3NTk5NTE2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional meeting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Para Profissionais</h3>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-gradient-to-br from-violet-600 to-purple-600 border-0 text-white">
              <p className="text-lg leading-relaxed">
                Uma ótima opção para profissionais de TI em busca de crescimento. 
                Conecte-se a empresas que valorizam inovação e desenvolvimento.
              </p>
            </Card>

            <div className="space-y-4">
              {professionalBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
