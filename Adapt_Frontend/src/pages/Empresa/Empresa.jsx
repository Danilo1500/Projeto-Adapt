import CompanyCreationInfo from "./components/CompanyCreationInfo";
import CreateCompanyCard from "./components/CreateCompanyCard";

const Empresa = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <CompanyCreationInfo />
        <CreateCompanyCard />
      </div>
    </div>
  );
};

export default Empresa;
