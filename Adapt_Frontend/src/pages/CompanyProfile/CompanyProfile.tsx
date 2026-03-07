import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Briefcase, Building2, ExternalLink, MapPin, Users } from "lucide-react";
import api from "../../api/axios";
import LoadingWhite from "./components/LoadingWhite";
import { CompanyHeader } from "./components/CompanyHeader";

interface CompanyMember {
  _id: string;
  full_name: string;
  username: string;
  profile_picture?: string;
}

interface CompanyData {
  _id: string;
  clerkOrganizationId: string;
  ownerId: string;
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
  certifications: {
    name: string;
    issuer: string;
    year: string;
    url?: string;
  }[];
  members: CompanyMember[];
}

interface CompanySummary {
  _id: string;
  name: string;
  industry: string;
  location: string;
  logo?: string;
}

const CompanyProfile: React.FC = () => {
  const { companyId } = useParams();
  const { getToken, userId } = useAuth();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [discoverCompanies, setDiscoverCompanies] = useState<CompanySummary[]>([]);

  const isOwnProfileRoute = !companyId;

  const loadOtherCompanies = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/company/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setDiscoverCompanies(data.companies || []);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const loadCompany = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const endpoint = isOwnProfileRoute ? "/api/company/my" : `/api/company/${companyId}`;
      const { data } = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success) {
        setCompany(null);
        setIsMember(false);
        setIsOwner(false);
        if (isOwnProfileRoute) {
          await loadOtherCompanies();
        }
        return;
      }

      setCompany(data.company);
      setIsOwner(Boolean(data.isOwner ?? data.company.ownerId === userId));
      setIsMember(Boolean(data.isMember ?? (data.company.members || []).some((m: CompanyMember) => m._id === userId)));
    } catch (error: any) {
      toast.error(error.message);
      setCompany(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
  }, [companyId, userId]);

  const handleJoinCompany = async () => {
    if (!company?._id) return;
    try {
      setJoining(true);
      const token = await getToken();
      const { data } = await api.post(
        `/api/company/${company._id}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) {
        toast.error(data.message || "Nao foi possivel participar da empresa.");
        return;
      }
      toast.success("Agora voce participa desta empresa.");
      await loadCompany();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setJoining(false);
    }
  };

  const uniqueTechnologies = useMemo(() => company?.technologies || [], [company?.technologies]);
  const uniqueFrameworks = useMemo(() => company?.frameworks || [], [company?.frameworks]);

  if (isLoading) {
    return <LoadingWhite />;
  }

  if (!company) {
    return (
      <div className="h-full overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h1 className="text-2xl font-semibold text-slate-900">Sua empresa ainda nao foi cadastrada</h1>
            <p className="mt-2 text-slate-600">
              Para acessar o perfil da sua empresa, crie uma organizacao primeiro.
            </p>
            <Link
              to="/empresa"
              className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Criar minha empresa
            </Link>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold text-slate-900">Empresas da comunidade</h2>
            <p className="mt-1 text-sm text-slate-600">
              Voce pode acessar e participar de empresas criadas por outros usuarios.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {discoverCompanies.length === 0 && (
                <div className="text-sm text-slate-500">Nenhuma empresa cadastrada ate o momento.</div>
              )}
              {discoverCompanies.map((item) => (
                <Link
                  key={item._id}
                  to={`/company/${item._id}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-indigo-300"
                >
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="h-11 w-11 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <Building2 size={18} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {item.industry || "Sem setor"} {item.location ? `• ${item.location}` : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6 no-scrollbar">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">
          <CompanyHeader
            name={company.name}
            industry={company.industry || "Setor nao informado"}
            size={company.size || "Tamanho nao informado"}
            location={company.location || "Localizacao nao informada"}
            website={company.website}
            cover={company.cover}
            logo={company.logo}
          />

          {!isOwner && !isMember && (
            <div className="px-6 pb-2 md:px-10">
              <button
                onClick={handleJoinCompany}
                disabled={joining}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  joining ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {joining ? "Entrando..." : "Participar da empresa"}
              </button>
            </div>
          )}

          {isOwner && (
            <div className="px-6 pb-2 text-sm text-emerald-700 md:px-10">
              Voce e o dono desta empresa.
            </div>
          )}

          {isMember && !isOwner && (
            <div className="px-6 pb-2 text-sm text-indigo-700 md:px-10">
              Voce ja participa desta empresa.
            </div>
          )}

          <div className="space-y-6 px-6 pb-8 pt-4 md:px-10">
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-600" />
                <h3 className="text-slate-900">Sobre a empresa</h3>
              </div>
              <p className="text-sm leading-6 text-slate-700">
                {company.description || "Descricao nao informada."}
              </p>
            </section>

            <section>
              <h3 className="mb-3 text-slate-900">Tecnologias</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueTechnologies.length === 0 && (
                  <span className="text-sm text-slate-500">Nenhuma tecnologia informada.</span>
                )}
                {uniqueTechnologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-slate-900">Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueFrameworks.length === 0 && (
                  <span className="text-sm text-slate-500">Nenhum framework informado.</span>
                )}
                {uniqueFrameworks.map((framework) => (
                  <span
                    key={framework}
                    className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm text-purple-700"
                  >
                    {framework}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-slate-900">Membros</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {(company.members || []).length === 0 && (
                  <span className="text-sm text-slate-500">Nenhum membro encontrado.</span>
                )}
                {company.members.map((member) => (
                  <div key={member._id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                    {member.profile_picture ? (
                      <img
                        src={member.profile_picture}
                        alt={member.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                        <Users className="h-5 w-5 text-slate-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{member.full_name}</p>
                      <p className="truncate text-xs text-slate-500">@{member.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-slate-900">Informacoes</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                  <div className="mb-1 flex items-center gap-1.5 text-slate-500">
                    <MapPin size={14} />
                    Localizacao
                  </div>
                  {company.location || "Nao informado"}
                </div>
                <div className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                  <div className="mb-1 flex items-center gap-1.5 text-slate-500">
                    <Users size={14} />
                    Tamanho
                  </div>
                  {company.size || "Nao informado"}
                </div>
              </div>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Acessar website <ExternalLink size={14} />
                </a>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
