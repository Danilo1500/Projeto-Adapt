import CompanyCreationInfo from "./components/CompanyCreationInfo";
import CreateCompanyCard from "./components/CreateCompanyCard";
import { useTheme } from "../../context/ThemeContext";

const Empresa = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <CompanyCreationInfo />
        <CreateCompanyCard />
      </div>
    </div>
  );
};

export default Empresa;
