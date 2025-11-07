import React, { useEffect, useState } from "react";
import { Building2, MapPin, Globe2, Users, Code2, Award } from "lucide-react";
import Loading from "../components/LoadingWhite";

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    // Simula a busca dos dados (pode trocar pela sua chamada ao backend ou Clerk)
    setTimeout(() => {
      setCompany({
        name: "Adapt Technologies",
        industry: "Tecnologia da Informação",
        size: "11-50 funcionários",
        location: "São Paulo, Brasil",
        website: "https://adapt-ti.com",
        description:
          "Soluções inteligentes para recrutamento e análise de talentos em tecnologia.",
        cover:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=60",
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
        technologies: ["React", "Node.js", "Flutter", "MySQL", "Clerk"],
        certifications: [
          {
            name: "GDPR Compliance",
            issuer: "UE",
            year: "2023",
            url: "https://example.com/gdpr",
          },
          {
            name: "ISO 27001",
            issuer: "ABNT",
            year: "2022",
            url: "https://example.com/iso27001",
          },
        ],
      });
    }, 800);
  }, []);

  if (!company) return <Loading />;

  return (
    <div className="relative h-full overflow-y-scroll bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6 no-scrollbar">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        {/* Capa */}
        <div className="relative h-48 md:h-64 bg-gray-200">
          {company.cover && (
            <img
              src={company.cover}
              alt="Capa da empresa"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Informações principais */}
        <div className="-mt-16 md:-mt-20 px-6 md:px-10 pb-6 flex items-end gap-4 relative z-10">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center">
            {company.logo ? (
              <img
                src={company.logo}
                alt="Logo"
                className="object-contain w-full h-full"
              />
            ) : (
              <Building2 className="text-indigo-600 w-10 h-10" />
            )}
          </div>

          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-bold">
              {company.name}
            </h1>
            <p className="text-shadow-gray-200 text-sm md:text-base">
              {company.industry}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-gray-500 mt-1 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {company.size}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {company.location}
              </div>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <Globe2 className="w-4 h-4" /> Site
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="px-6 md:px-10 pb-6 border-b border-gray-100">
          <p className="text-gray-700 leading-relaxed">
            {company.description}
          </p>
        </div>

        {/* Tecnologias */}
        <div className="px-6 md:px-10 py-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Code2 className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-gray-900 font-semibold">
              Tecnologias Utilizadas
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {company.technologies.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Certificações */}
        <div className="px-6 md:px-10 py-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-gray-900 font-semibold">Certificações</h3>
          </div>
          <div className="grid gap-3">
            {company.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 hover:border-indigo-200 hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="text-gray-900 font-medium">
                    {cert.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {cert.issuer} • {cert.year}
                  </div>
                </div>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Ver
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
