import { motion } from "framer-motion";
import { Code, Smartphone, Database, Cloud, Shield, Cpu } from "lucide-react";
import { Button } from "./ui/button";

export function ModernCategories() {
  const categories = [
    {
      icon: <Code className="size-6" />,
      title: "Desenvolvimento Full Stack",
      jobs: "1.2k+ vagas",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Smartphone className="size-6" />,
      title: "Desenvolvimento Mobile",
      jobs: "850+ vagas",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Database className="size-6" />,
      title: "Banco de Dados & DBA",
      jobs: "620+ vagas",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Cloud className="size-6" />,
      title: "DevOps & Cloud",
      jobs: "940+ vagas",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Shield className="size-6" />,
      title: "Segurança da Informação",
      jobs: "480+ vagas",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: <Cpu className="size-6" />,
      title: "Data Science & IA",
      jobs: "730+ vagas",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Explore oportunidades
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre vagas nas principais áreas de tecnologia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`bg-gradient-to-br ${category.gradient} size-14 rounded-xl flex items-center justify-center text-white mb-4 group-hover:bg-white group-hover:text-[#4600ff] transition-all duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                  {category.jobs}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Button size="lg" className="bg-[#4600ff] hover:bg-[#3800cc] text-white rounded-full px-8">
            Ver Todas as Vagas
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
