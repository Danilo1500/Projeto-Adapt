import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Code2, Cpu, Database, Layers3, LockKeyhole, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Category = {
  icon: JSX.Element;
  title: string;
  tags: string[];
};

export function ModernCategories() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Produto e UX");
  const [selectedTag, setSelectedTag] = useState("Design");

  const categories: Category[] = [
    { icon: <Code2 className="size-6" />, title: "Desenvolvimento", tags: ["Front-end", "Back-end", "Full stack"] },
    { icon: <Cpu className="size-6" />, title: "Cloud e DevOps", tags: ["AWS", "CI/CD", "Infraestrutura"] },
    { icon: <Database className="size-6" />, title: "Dados e IA", tags: ["BI", "Machine learning", "Analytics"] },
    { icon: <LockKeyhole className="size-6" />, title: "Segurança", tags: ["AppSec", "SOC", "Compliance"] },
    { icon: <Layers3 className="size-6" />, title: "Produto e UX", tags: ["Product", "Design", "Pesquisa"] },
    { icon: <Sparkles className="size-6" />, title: "Início de carreira", tags: ["Estágio", "Júnior", "Trainee"] },
  ];

  const activeLabel = useMemo(() => {
    if (!selectedCategory) return "Todas as áreas";
    return selectedTag ? `${selectedCategory} / ${selectedTag}` : selectedCategory;
  }, [selectedCategory, selectedTag]);

  const clearFilter = () => {
    setSelectedCategory("");
    setSelectedTag("");
  };

  return (
    <section id="categories" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="mb-3 text-sm font-black uppercase text-[#4600ff]">Filtro de vagas</p>
            <h2 className="text-4xl font-black leading-tight text-gray-950 md:text-5xl">
              Escolha uma área e refine pelas tecnologias ou trilhas mais importantes.
            </h2>
          </motion.div>

          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="h-12 rounded-full bg-gray-950 px-7 text-white hover:bg-[#4600ff]"
          >
            Ver oportunidades
          </Button>
        </div>

        <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border border-gray-200 bg-[#f7f9fc] p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-gray-500">Filtro ativo</p>
            <p className="text-lg font-black text-gray-950">{activeLabel}</p>
          </div>
          {(selectedCategory || selectedTag) && (
            <button
              type="button"
              onClick={clearFilter}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-gray-700 shadow-sm transition-colors hover:text-[#4600ff]"
            >
              <X className="size-4" />
              Limpar filtro
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category.title;

            return (
              <motion.article
                key={category.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                onClick={() => {
                  setSelectedCategory(category.title);
                  setSelectedTag("");
                }}
                className={`group cursor-pointer rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/10 ${
                  isSelected
                    ? "border-[#4600ff]/40 bg-white shadow-xl shadow-[#4600ff]/10"
                    : "border-gray-200 bg-[#f7f9fc]"
                }`}
              >
                <div
                  className={`mb-8 flex size-14 items-center justify-center rounded-xl shadow-sm transition-colors ${
                    isSelected
                      ? "bg-[#4600ff] text-white"
                      : "bg-white text-[#4600ff] group-hover:bg-[#4600ff] group-hover:text-white"
                  }`}
                >
                  {category.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-950">{category.title}</h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  {category.tags.map((tag) => {
                    const isTagSelected = isSelected && selectedTag === tag;

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedCategory(category.title);
                          setSelectedTag(isTagSelected ? "" : tag);
                        }}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                          isTagSelected
                            ? "bg-[#4600ff] text-white"
                            : "bg-white text-gray-700 hover:bg-[#4600ff]/10 hover:text-[#4600ff]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
