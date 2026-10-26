import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export function ModernTestimonials() {
  const testimonials = [
    {
      name: "Marina Costa",
      role: "Desenvolvedora Full Stack",
      content: "O ADAPT deixou minhas experiências muito mais visíveis. As conversas que chegaram tinham relação real com meu perfil.",
    },
    {
      name: "Rafael Nunes",
      role: "Tech Recruiter",
      content: "Conseguimos entender aderência antes da primeira entrevista. Isso reduziu retrabalho e melhorou a conversa com o time técnico.",
    },
    {
      name: "Bianca Torres",
      role: "Product Designer",
      content: "Gostei de encontrar vagas e conexões no mesmo ambiente. A plataforma deixa o processo menos frio e mais objetivo.",
    },
  ];

  return (
    <section id="testimonials" className="bg-[#f7f9fc] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="mb-3 text-sm font-black uppercase text-[#4600ff]">Resultados</p>
          <h2 className="text-4xl font-black leading-tight text-gray-950 md:text-5xl">
            Mais clareza para quem busca vaga e para quem contrata.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="size-4 fill-current" />
                  ))}
                </div>
                <Quote className="size-8 text-[#4600ff]/20" />
              </div>
              <p className="leading-relaxed text-gray-700">"{testimonial.content}"</p>
              <div className="mt-8 border-t border-gray-100 pt-5">
                <p className="font-black text-gray-950">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
