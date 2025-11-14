import React, { useEffect, useState } from "react";
import LoadingWhite from "./components/LoadingWhite";
import { CompanyHeader } from "./components/CompanyHeader";
import { Code2, Layers, Award, FileText, ExternalLink, Briefcase, Users } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

interface Certification {
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  link?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Company {
  name: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  description: string;
  cover?: string;
  logo?: string;
  technologies: string[];
  frameworks: string[];
  certifications: Certification[];
  projects: Project[];
  team: TeamMember[];
}

// Mock data - pode ser substituído por uma chamada real à API
const fetchCompanyData = (): Promise<Company> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "Adapt Technologies",
        industry: "Tecnologia da Informação",
        size: "11-50 funcionários",
        location: "São Paulo, Brasil",
        website: "https://adapt-ti.com",
        description:
          "Soluções inteligentes para recrutamento e análise de talentos em tecnologia. Transformamos a forma como empresas identificam e contratam os melhores profissionais.",
        cover:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=60",
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
        technologies: ["JavaScript", "TypeScript", "Python", "Java", "Go"],
        frameworks: ["React", "Node.js", "Flutter", "Express", "Nest.js"],
        certifications: [
          {
            name: "GDPR Compliance",
            issuer: "União Europeia",
            year: "2023",
            url: "https://example.com/gdpr",
          },
          {
            name: "ISO 27001",
            issuer: "ABNT",
            year: "2022",
            url: "https://example.com/iso27001",
          },
          {
            name: "AWS Partner",
            issuer: "Amazon Web Services",
            year: "2024",
          },
        ],
        projects: [
          {
            id: "1",
            title: "Sistema de Recrutamento IA",
            description: "Plataforma completa de recrutamento com análise de candidatos usando inteligência artificial",
            image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=60",
            technologies: ["React", "Python", "TensorFlow"],
            link: "https://example.com/project1"
          },
          {
            id: "2",
            title: "Portal de Talentos",
            description: "Marketplace que conecta empresas e profissionais de tecnologia",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=60",
            technologies: ["React", "Node.js", "MongoDB"],
            link: "https://example.com/project2"
          },
          {
            id: "3",
            title: "Analytics Dashboard",
            description: "Dashboard de métricas e insights para gestão de equipes de tecnologia",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=60",
            technologies: ["React", "D3.js", "PostgreSQL"],
          },
        ],
        team: [
          {
            id: "1",
            name: "Ana Silva",
            role: "CEO & Founder",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=60"
          },
          {
            id: "2",
            name: "Carlos Santos",
            role: "CTO",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=60"
          },
          {
            id: "3",
            name: "Maria Oliveira",
            role: "Head of Product",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=60"
          },
          {
            id: "4",
            name: "João Costa",
            role: "Lead Developer",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60"
          },
        ],
      });
    }, 800);
  });
};

const CompanyProfile: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const data = await fetchCompanyData();
        setCompany(data);
      } catch (error) {
        console.error("Erro ao carregar dados da empresa:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyData();
  }, []);

  if (isLoading || !company) {
    return <LoadingWhite />;
  }

  return (
    <div className="relative h-full overflow-y-scroll bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6 no-scrollbar">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <CompanyHeader
            name={company.name}
            industry={company.industry}
            size={company.size}
            location={company.location}
            website={company.website}
            cover={company.cover}
            logo={company.logo}
          />

          {/* Skills & Technologies Section */}
          <div className="px-6 pb-6 pt-4 space-y-6">
            {/* Linguagens */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-gray-900">Linguagens</h3>
              </div>
              {company.technologies && company.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {company.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border border-indigo-200 hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">Nenhuma linguagem informada</p>
              )}
            </div>

            {/* Frameworks */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Layers className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-gray-900">Frameworks / Bibliotecas</h3>
              </div>
              {company.frameworks && company.frameworks.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {company.frameworks.map((fw) => (
                    <span
                      key={fw}
                      className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200 hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">Nenhum framework adicionado</p>
              )}
            </div>

            {/* Certificados */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-gray-900">Certificações</h3>
              </div>

              {company.certifications && company.certifications.length > 0 ? (
                <div className="grid gap-3">
                  {company.certifications.map((cert, i) => (
                    <div
                      key={i}
                      className="group/cert flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 hover:border-indigo-200 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-amber-50 rounded-lg flex-shrink-0 mt-0.5">
                          <FileText className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-900 truncate pr-2">
                            {cert.name}
                          </div>
                          <div className="text-gray-500 mt-1">
                            {cert.issuer} {cert.year && `• ${cert.year}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-3">
                        {cert.url ? (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 border-2 border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 group-hover/cert:shadow-md"
                          >
                            <span className="text-sm">Ver</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-100 rounded-lg">
                            Certificado
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">Nenhuma certificação adicionada</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-1.5 flex max-w-md mx-auto border border-gray-100">
            {["about", "projects", "team"].map((tab) => (
              <button
                onClick={() => setActiveTab(tab)}
                key={tab}
                className={`flex-1 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab === "about" && "Sobre"}
                {tab === "projects" && "Projetos"}
                {tab === "team" && "Equipe"}
              </button>
            ))}
          </div>

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="mt-6">
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-gray-900">Sobre a Empresa</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {company.description}
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-gray-900 mb-4">Nossa Missão</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Democratizar o acesso a talentos de tecnologia de alta qualidade,
                    conectando empresas inovadoras com profissionais excepcionais através
                    de tecnologia de ponta e processos humanizados.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="mt-6">
              {company.projects && company.projects.length > 0 ? (
                <div className="grid gap-6">
                  {company.projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                      {project.image && (
                        <div className="relative h-48 md:h-64 overflow-hidden">
                          <ImageWithFallback
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-gray-900 mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-sm rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <span>Ver projeto</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
                  <div className="text-gray-400 mb-2">Nenhum projeto ainda</div>
                  <p className="text-gray-500">
                    Projetos da empresa aparecerão aqui
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div className="mt-6">
              {company.team && company.team.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {company.team.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 text-center"
                    >
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-indigo-100">
                        {member.avatar ? (
                          <ImageWithFallback
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                            <Users className="w-10 h-10 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-gray-500">{member.role}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
                  <div className="text-gray-400 mb-2">Nenhum membro ainda</div>
                  <p className="text-gray-500">
                    Membros da equipe aparecerão aqui
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
