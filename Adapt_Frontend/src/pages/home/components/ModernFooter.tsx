import { Instagram, Linkedin, Twitter, Mail } from "lucide-react";

export function ModernFooter() {
  const footerSections = [
    {
      title: "Plataforma",
      links: ["Como Funciona", "Vagas", "Empresas", "Preços", "Blog"],
    },
    {
      title: "Recursos",
      links: ["Ajuda", "FAQ", "Termos de Uso", "Privacidade", "Contato"],
    },
    {
      title: "Empresa",
      links: ["Sobre Nós", "Carreiras", "Imprensa", "Parceiros", "Investidores"],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-[#4600ff] h-12 w-12 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-black">TI</span>
              </div>
              <span className="text-2xl font-black text-white">ADAPT</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              A plataforma que conecta os melhores profissionais de tecnologia 
              com as empresas mais inovadoras do mercado.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-[#4600ff] text-white size-10 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-[#4600ff] text-white size-10 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Linkedin className="size-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-[#4600ff] text-white size-10 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Twitter className="size-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-[#4600ff] text-white size-10 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Mail className="size-5" />
              </a>
            </div>
          </div>

          {/* Links sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#4600ff] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 ADAPT TI. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-[#4600ff] transition-colors duration-200">
                Termos de Serviço
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4600ff] transition-colors duration-200">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4600ff] transition-colors duration-200">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
