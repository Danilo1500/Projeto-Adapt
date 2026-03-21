import { Building2, ShieldCheck, Users } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const items = [
  {
    icon: Building2,
    title: "Perfil da empresa",
    text: "Crie a organização no Clerk e use como empresa dentro da plataforma.",
  },
  {
    icon: Users,
    title: "Convide o time",
    text: "Depois da criação, você pode convidar recrutadores e gestores.",
  },
  {
    icon: ShieldCheck,
    title: "Controle de acesso",
    text: "Gerencie permissões por membro usando os recursos de organização do Clerk.",
  },
];

const CompanyCreationInfo = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside
      className={`w-full rounded-2xl border p-6 ${
        isDark ? "border-slate-700 bg-slate-800" : "border-indigo-100 bg-indigo-50"
      }`}
    >
      <h2 className={`text-lg font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
        Criar empresa
      </h2>
      <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
        Use o formulário ao lado para registrar sua organização.
      </p>

      <div className="mt-6 space-y-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <div
              className={`rounded-lg p-2 ${
                isDark ? "bg-slate-900 text-indigo-300" : "bg-white text-indigo-600"
              }`}
            >
              <Icon size={18} />
            </div>
            <div>
              <h3 className={`text-sm font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                {title}
              </h3>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default CompanyCreationInfo;
