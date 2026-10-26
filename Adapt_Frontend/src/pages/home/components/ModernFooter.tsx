import { Instagram, Linkedin, Mail } from "lucide-react";
import { Logo } from "./Logo";

export function ModernFooter() {
  const footerSections = [
    {
      title: "Produto",
      links: ["Como funciona", "Benefícios", "Vagas", "Empresas"],
    },
    {
      title: "Conta",
      links: ["Entrar", "Criar perfil", "Publicar vaga", "Suporte"],
    },
    {
      title: "Legal",
      links: ["Termos de uso", "Privacidade", "Cookies", "Contato"],
    },
  ];

  return (
    <footer className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-gray-200 pb-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo className="h-11 w-auto" />
            <p className="mt-5 max-w-sm leading-relaxed text-gray-600">
              A rede profissional para conectar talentos de tecnologia, empresas e oportunidades com mais contexto.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: <Instagram className="size-5" />, label: "Instagram" },
                { icon: <Linkedin className="size-5" />, label: "LinkedIn" },
                { icon: <Mail className="size-5" />, label: "Email" },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  aria-label={item.label}
                  className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors hover:bg-[#4600ff] hover:text-white"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-black text-gray-950">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 transition-colors hover:text-[#4600ff]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 pt-8 text-sm text-gray-500 md:flex-row md:items-center">
          <p>© 2026 ADAPT TI. Todos os direitos reservados.</p>
          <p>Feito para aproximar pessoas, times e tecnologia.</p>
        </div>
      </div>
    </footer>
  );
}
