import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter, Mail } from "lucide-react";
import svgPaths from "../imports/svg-dph6lrz7am";

function AdaptLogoSmall() {
  return (
    <div className="absolute inset-[2.09%_3.15%_-84.31%_-36.48%]" data-name="layer1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 278 412">
        <g id="layer1">
          <path d={svgPaths.p1c82e900} fill="url(#paint0_linear_footer)" id="rect1132" />
          <path d={svgPaths.p17514840} fill="url(#paint1_linear_footer)" id="rect1137" />
          <path d={svgPaths.p2eee5ec0} fill="var(--fill-0, white)" id="path235" />
          <path d={svgPaths.p11181000} fill="var(--fill-0, white)" id="path233" />
          <g id="g18">
            <path d={svgPaths.p8f04e70} fill="var(--fill-0, #000055)" id="path6" />
            <path d={svgPaths.p1ba38780} fill="var(--fill-0, white)" id="path2" />
            <path d={svgPaths.pc4d3b80} fill="var(--fill-0, white)" id="path3" />
            <path d={svgPaths.p1ecc1800} fill="var(--fill-0, #2A2AFF)" id="path4" />
            <path d={svgPaths.p3153d000} fill="var(--fill-0, #5555FF)" id="path5" />
            <path d={svgPaths.p112d8440} fill="var(--fill-0, #8080FF)" id="path7" />
            <path d={svgPaths.p1ace5b80} fill="var(--fill-0, white)" id="path8" />
          </g>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_footer" x1="185.453" x2="185.453" y1="49.6226" y2="197.991">
            <stop />
            <stop offset="1" stopColor="#4600FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_footer" x1="172.501" x2="172.501" y1="68.3283" y2="196.716">
            <stop />
            <stop offset="1" stopColor="#4600FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function FooterNew() {
  const links = {
    platform: [
      { name: "Para Empresas", href: "#" },
      { name: "Para Profissionais", href: "#" },
      { name: "Como Funciona", href: "#" },
      { name: "Preços", href: "#" }
    ],
    company: [
      { name: "Sobre Nós", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Carreiras", href: "#" },
      { name: "Contato", href: "#" }
    ],
    legal: [
      { name: "Termos de Uso", href: "#" },
      { name: "Política de Privacidade", href: "#" },
      { name: "Cookies", href: "#" },
      { name: "FAQ", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "#", label: "Email" }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-12 w-12 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                <span className="text-[#4600ff] font-['Inter'] font-bold text-lg">TI</span>
              </div>
              <span className="text-white font-['Archivo_Black'] text-2xl">Adapt</span>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Conectando programadores talentosos com empresas inovadoras. 
              Transforme sua carreira com a plataforma que entende suas necessidades.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Plataforma */}
          <div>
            <h3 className="text-white font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-3">
              {links.platform.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3">
              {links.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {links.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Adapt TI. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>Feito com 💜 para desenvolvedores</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
