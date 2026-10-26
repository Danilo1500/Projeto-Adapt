import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

export function ModernHeader() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Como funciona", href: "#how-it-works" },
    { name: "Benefícios", href: "#benefits" },
    { name: "Vagas", href: "#categories" },
    { name: "Resultados", href: "#testimonials" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <a href="#home" aria-label="Ir para o início">
            <Logo className="h-11 w-auto" />
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-[#4600ff]"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="rounded-full px-5 text-gray-700 hover:text-[#4600ff]"
            >
              Entrar
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="rounded-full bg-[#4600ff] px-6 text-white shadow-sm shadow-[#4600ff]/30 hover:bg-[#3800cc]"
            >
              Começar
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#4600ff] md:hidden"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="space-y-1 border-t border-gray-200 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block rounded-lg px-3 py-3 text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#4600ff]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <Button
                  onClick={() => navigate("/")}
                  className="mt-3 w-full rounded-full bg-[#4600ff] text-white hover:bg-[#3800cc]"
                >
                  Entrar no ADAPT
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
