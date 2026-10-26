import React, { useEffect, useRef, useState } from "react";
import { ChevronUp, Code2, Cpu, Database, Layers3, LockKeyhole, Search, Sparkles, X } from "lucide-react";
import UserCard from "../components/UserCard";
import CompanyCard from "../components/CompanyCard";
import Loading from "../components/LoadingWhite";
import DiscoverJobCard from "../jobCreation/components/DiscoverJobCard";
import api from "../../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const Discover = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobSources, setJobSources] = useState({ internal: 0, external: 0 });
  const [recommendedMode, setRecommendedMode] = useState(false);
  const [recommendationHasMore, setRecommendationHasMore] = useState(false);
  const [recommendationPage, setRecommendationPage] = useState(1);
  const [recommendationTruncated, setRecommendationTruncated] = useState(false);
  const [recommendationLimit, setRecommendationLimit] = useState(500);
  const [selectedJobCategory, setSelectedJobCategory] = useState("");
  const [selectedJobTag, setSelectedJobTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const scrollContainerRef = useRef(null);

  const tabs = ["vagas", "pessoas", "empresas"];
  const [activeTab, setActiveTab] = useState("pessoas");

  const jobCategories = [
    {
      icon: <Code2 className="size-6" />,
      title: "Desenvolvimento",
      tags: ["Front-end", "Back-end", "Full stack"],
      keywords: ["developer", "desenvolvedor", "desenvolvedora", "frontend", "front-end", "backend", "back-end", "full stack", "fullstack", "software", "programador", "react", "node", "java", "python"],
    },
    {
      icon: <Cpu className="size-6" />,
      title: "Cloud e DevOps",
      tags: ["AWS", "CI/CD", "Infraestrutura"],
      keywords: ["cloud", "devops", "aws", "azure", "gcp", "ci/cd", "cicd", "infraestrutura", "infrastructure", "kubernetes", "docker", "sre"],
    },
    {
      icon: <Database className="size-6" />,
      title: "Dados e IA",
      tags: ["BI", "Machine learning", "Analytics"],
      keywords: ["data", "dados", "analytics", "bi", "business intelligence", "machine learning", "ml", "ai", "ia", "scientist", "analyst", "analista", "sql"],
    },
    {
      icon: <LockKeyhole className="size-6" />,
      title: "Segurança",
      tags: ["AppSec", "SOC", "Compliance"],
      keywords: ["segurança", "seguranca", "security", "appsec", "soc", "compliance", "cyber", "cibersegurança", "ciberseguranca", "pentest"],
    },
    {
      icon: <Layers3 className="size-6" />,
      title: "Produto e UX",
      tags: ["Product", "Design", "Pesquisa"],
      keywords: ["product", "produto", "ux", "ui", "design", "designer", "research", "pesquisa", "product manager", "po", "pm"],
    },
    {
      icon: <Sparkles className="size-6" />,
      title: "Início de carreira",
      tags: ["Estágio", "Júnior", "Trainee"],
      keywords: ["estágio", "estagio", "intern", "internship", "júnior", "junior", "trainee", "entry level", "aprendiz"],
    },
  ];

  const getAuthHeaders = async (refresh = false) => {
    if (!isLoaded || !isSignedIn) {
      throw new Error("Sua sessao ainda nao esta pronta. Tente novamente em instantes.");
    }

    const token = await getToken(refresh ? { skipCache: true } : undefined);

    if (!token) {
      throw new Error("Nao foi possivel validar sua sessao. Recarregue a pagina e tente novamente.");
    }

    return { Authorization: `Bearer ${token}` };
  };

  const requestWithAuth = async (request) => {
    try {
      return await request(await getAuthHeaders());
    } catch (error) {
      if (error?.response?.status === 401) {
        return request(await getAuthHeaders(true));
      }

      throw error;
    }
  };

  const fetchUsers = async (searchText = "") => {
    const { data } = await requestWithAuth((headers) =>
      api.post(
        "/api/user/discover",
        { input: searchText },
        { headers }
      )
    );
    if (!data.success) throw new Error(data.message);
    setUsers(data.users || []);
  };

  const fetchCompanies = async (searchText = "") => {
    const { data } = await requestWithAuth((headers) =>
      api.get("/api/company/list", {
        params: { q: searchText },
        headers,
      })
    );
    if (!data.success) throw new Error(data.message);
    setCompanies(data.companies || []);
  };

  const fetchJobs = async (searchText = "") => {
    const { data } = await api.get("/api/job/public", {
      params: { q: searchText },
    });
    if (!data.success) throw new Error(data.message);
    const mapped = (data.jobs || []).map((job) => ({
      ...job,
      id: job._id || job.id,
      createdAt: job.createdAt ? new Date(job.createdAt) : undefined,
    }));
    setJobs(mapped);
    setJobSources(data.sources || { internal: 0, external: 0 });
    setRecommendedMode(false);
    setRecommendationHasMore(false);
    setRecommendationPage(1);
    setRecommendationTruncated(false);
  };

  const fetchRecommendedJobs = async (page = 1, append = false) => {
    const { data } = await requestWithAuth((headers) =>
      api.get("/api/job/recommended", { params: { page, limit: 10 }, headers })
    );
    if (!data.success) throw new Error(data.message);
    const mapped = (data.jobs || []).map((job) => ({
      ...job,
      id: job._id || job.id,
      createdAt: job.createdAt ? new Date(job.createdAt) : undefined,
    }));
    setJobs((current) => append ? [...current, ...mapped] : mapped);
    setJobSources({ internal: 0, external: 0 });
    setRecommendedMode(true);
    setRecommendationHasMore(Boolean(data.hasMore));
    setRecommendationPage(data.page || page);
    setRecommendationTruncated(Boolean(data.candidatePoolTruncated));
    setRecommendationLimit(data.candidatePoolLimit || 500);
  };

  const handleSearch = async (event) => {
    if (event.key !== "Enter") return;
    try {
      setLoading(true);
      if (activeTab === "pessoas") {
        await fetchUsers(input);
      } else if (activeTab === "vagas") {
        await fetchJobs(input);
      } else if (activeTab === "empresas") {
        await fetchCompanies(input);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendedJobs = async () => {
    try {
      setLoading(true);
      await fetchRecommendedJobs();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeJob = async (job) => {
    try {
      const { data } = await requestWithAuth((headers) => job._id
        ? api.get(`/api/job/${job._id}/match`, { headers })
        : api.post("/api/job/analyze", {
            title: job.title,
            company: job.company,
            location: job.location,
            contractType: job.contractType,
            experienceLevel: job.experienceLevel,
            description: job.description,
            requirements: job.requirements,
            desiredRequirements: job.desiredRequirements,
            category: job.category,
            isRemote: job.isRemote,
            workMode: job.workMode,
          }, { headers })
      );
      if (!data.success) throw new Error(data.message || "Não foi possível analisar esta vaga.");
      setJobs((current) => current.map((item) =>
        (item._id || item.id) === (job._id || job.id) ? { ...item, aiMatch: data.match } : item
      ));
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleMoreRecommendedJobs = async () => {
    try {
      setLoading(true);
      await fetchRecommendedJobs(recommendationPage + 1, true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompany = async (companyId) => {
    try {
      const { data } = await requestWithAuth((headers) =>
        api.post(
          `/api/company/${companyId}/join`,
          {},
          { headers }
        )
      );
      if (!data.success) {
        toast.error(data.message || "Nao foi possivel participar da empresa.");
        return;
      }
      toast.success("Agora voce participa desta empresa.");
      await fetchCompanies(input);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        setLoading(true);
        if (activeTab === "pessoas") {
          await fetchUsers("");
        } else if (activeTab === "vagas") {
          await fetchJobs("");
        } else if (activeTab === "empresas") {
          await fetchCompanies("");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [activeTab, isLoaded, isSignedIn]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScrollVisibility = () => {
      setShowScrollTop(container.scrollTop > 260);
    };

    handleScrollVisibility();
    container.addEventListener("scroll", handleScrollVisibility);

    return () => {
      container.removeEventListener("scroll", handleScrollVisibility);
    };
  }, []);

  const handleScrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const normalizeText = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const getJobSearchText = (job) =>
    normalizeText(
      [
        job.title,
        job.company,
        job.location,
        job.contractType,
        job.experienceLevel,
        job.description,
        ...(Array.isArray(job.requirements) ? job.requirements : []),
        ...(Array.isArray(job.benefits) ? job.benefits : []),
      ].join(" ")
    );

  const selectedCategoryData = jobCategories.find((category) => category.title === selectedJobCategory);
  const filteredJobs = jobs.filter((job) => {
    if (!selectedCategoryData && !selectedJobTag) return true;

    const jobText = getJobSearchText(job);
    const categoryMatches = selectedCategoryData
      ? selectedCategoryData.keywords.some((keyword) => jobText.includes(normalizeText(keyword)))
      : true;
    const tagMatches = selectedJobTag ? jobText.includes(normalizeText(selectedJobTag)) : true;

    return categoryMatches && tagMatches;
  });

  const activeJobFilterLabel = selectedJobCategory
    ? selectedJobTag
      ? `${selectedJobCategory} / ${selectedJobTag}`
      : selectedJobCategory
    : "Todas as áreas";

  const clearJobFilter = () => {
    setSelectedJobCategory("");
    setSelectedJobTag("");
  };

  return (
    <div
      ref={scrollContainerRef}
      className={`h-full overflow-y-auto no-scrollbar ${
        isDark ? "bg-slate-900" : "bg-gradient-to-b from-slate-50 to-white"
      }`}
    >
      <div className="mx-auto max-w-6xl p-6 pb-6">
        <div className="mb-8">
          <h1 className={`mb-2 text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Discover
          </h1>
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>
            Explore oportunidades, pessoas e empresas incriveis
          </p>
        </div>

        <div className="mb-6 flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 cursor-pointer rounded-xl px-4 py-2.5 transition-all duration-200 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div
          className={`mb-5 rounded-md border shadow-md ${
            isDark ? "border-slate-700 bg-slate-800/80" : "border-slate-200/60 bg-white/80"
          }`}
        >
          <div className="p-5">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform ${
                  isDark ? "text-slate-400" : "text-slate-400"
                }`}
              />
              <input
                type="text"
                placeholder={`Buscar por ${
                  activeTab === "vagas"
                    ? "vaga, cargo ou empresa..."
                    : activeTab === "pessoas"
                    ? "nome, usuario ou localizacao..."
                    : "nome da empresa, setor ou cidade..."
                }`}
                className={`w-full rounded-md border py-2 pl-10 sm:pl-12 max-sm:text-sm outline-none ${
                  isDark
                    ? "border-slate-600 bg-slate-900 text-slate-100 placeholder:text-slate-500"
                    : "border-gray-300 bg-white text-slate-900 placeholder:text-slate-400"
                }`}
                onChange={(event) => setInput(event.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>

        {activeTab === "vagas" && (
          <div className="mb-6">
            <div
              className={`mb-3 flex flex-col justify-between gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center ${
                isDark
                  ? "border-slate-700 bg-slate-800/80"
                  : "border-indigo-100 bg-indigo-50/70"
              }`}
            >
              <div>
                <p className={isDark ? "text-sm font-semibold text-slate-400" : "text-sm font-semibold text-slate-500"}>
                  Filtro ativo
                </p>
                <p className={isDark ? "text-base font-bold text-slate-100" : "text-base font-bold text-slate-900"}>
                  {activeJobFilterLabel}
                </p>
              </div>
              {(selectedJobCategory || selectedJobTag) && (
                <button
                  type="button"
                  onClick={clearJobFilter}
                  className={`inline-flex h-9 items-center justify-center gap-2 rounded-full px-3 text-xs font-semibold shadow-sm transition-colors ${
                    isDark
                      ? "bg-slate-900 text-slate-200 hover:text-violet-300"
                      : "bg-white text-slate-700 hover:text-violet-700"
                  }`}
                >
                  <X className="h-4 w-4" />
                  Limpar filtro
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
              {jobCategories.map((category) => {
                const isSelected = selectedJobCategory === category.title;

                return (
                  <button
                    key={category.title}
                    type="button"
                    onClick={() => {
                      setSelectedJobCategory(category.title);
                      setSelectedJobTag("");
                    }}
                    className={`group rounded-lg border px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      isSelected
                        ? isDark
                          ? "border-violet-400 bg-slate-800 shadow-md shadow-violet-950/30"
                          : "border-violet-300 bg-white shadow-md shadow-violet-200/60"
                        : isDark
                        ? "border-slate-700 bg-slate-800/70 hover:border-violet-500/60"
                        : "border-slate-200 bg-slate-50 hover:border-violet-200"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md shadow-sm transition-colors [&_svg]:size-4 ${
                          isSelected
                            ? "bg-violet-700 text-white"
                            : isDark
                            ? "bg-slate-900 text-violet-300 group-hover:bg-violet-700 group-hover:text-white"
                            : "bg-white text-violet-700 group-hover:bg-violet-700 group-hover:text-white"
                        }`}
                      >
                        {category.icon}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-950"}`}>
                          {category.title}
                        </span>

                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {category.tags.map((tag) => {
                            const isTagSelected = isSelected && selectedJobTag === tag;

                            return (
                              <span
                                key={tag}
                                role="button"
                                tabIndex={0}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedJobCategory(category.title);
                                  setSelectedJobTag(isTagSelected ? "" : tag);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key !== "Enter" && event.key !== " ") return;
                                  event.preventDefault();
                                  event.stopPropagation();
                                  setSelectedJobCategory(category.title);
                                  setSelectedJobTag(isTagSelected ? "" : tag);
                                }}
                                className={`rounded-full px-2.5 py-1 text-[11px] font-bold leading-none transition-colors ${
                                  isTagSelected
                                    ? "bg-violet-700 text-white"
                                    : isDark
                                    ? "bg-slate-900 text-slate-300 hover:bg-violet-900/60 hover:text-white"
                                    : "bg-white text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                                }`}
                              >
                                {tag}
                              </span>
                            );
                          })}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading && <Loading height="45vh" size={48} />}

        {!loading && (
          <>
            {activeTab === "vagas" && (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className={isDark ? "text-sm text-slate-300" : "text-sm text-slate-600"}>
                    {recommendedMode
                      ? "Vagas ordenadas por cobertura dos requisitos técnicos identificados."
                      : "Busque vagas ou gere recomendacoes com base no seu portfolio."}
                  </div>
                  <button
                    type="button"
                    onClick={handleRecommendedJobs}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    Encontrar vagas compatíveis
                  </button>
                </div>

                {recommendedMode && recommendationTruncated && (
                  <p className="mb-4 text-xs text-slate-500">
                    Para manter a resposta rápida, o ranking considera até {recommendationLimit} das vagas locais mais recentes.
                  </p>
                )}

                {jobSources.external > 0 && (
                  <div
                    className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                      isDark
                        ? "border-slate-700 bg-slate-800 text-slate-300"
                        : "border-indigo-100 bg-indigo-50 text-slate-700"
                    }`}
                  >
                    Esta demonstracao inclui {jobSources.external} vagas da Remotive para enriquecer a busca.
                  </div>
                )}
                <div className="flex flex-wrap gap-6">
                  {filteredJobs && filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <DiscoverJobCard
                        key={job.id}
                        job={job}
                        onAnalyze={handleAnalyzeJob}
                      />
                    ))
                  ) : (
                    <div className={`text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Nenhuma vaga encontrada para esse filtro.
                    </div>
                  )}
                </div>
                {recommendedMode && recommendationHasMore && !loading && (
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={handleMoreRecommendedJobs}
                      className="rounded-lg border border-indigo-200 bg-white px-5 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                    >
                      Carregar mais recomendações
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === "pessoas" && (
              <div className="flex flex-wrap gap-6">
                {users.map((user) => (
                  <UserCard user={user} key={user._id} />
                ))}
              </div>
            )}

            {activeTab === "empresas" && (
              <div className="flex flex-wrap gap-6">
                {companies && companies.length > 0 ? (
                  companies.map((company) => (
                    <CompanyCard key={company._id} company={company} onJoin={handleJoinCompany} />
                  ))
                ) : (
                  <div
                    className={`mx-auto max-w-md rounded-2xl border p-12 text-center shadow-md ${
                      isDark ? "border-slate-700 bg-slate-800" : "border-gray-100 bg-white"
                    }`}
                  >
                    <div className={`mb-2 ${isDark ? "text-slate-400" : "text-gray-400"}`}>
                      Nenhuma empresa encontrada
                    </div>
                    <p className={isDark ? "text-slate-400" : "text-gray-500"}>
                      Tente pesquisar novamente
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <button
        type="button"
        aria-label="Voltar ao topo"
        onClick={handleScrollToTop}
        className={`fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full border shadow-xl transition-all duration-500 ease-out ${
          isDark
            ? "border-slate-600 bg-slate-800 text-slate-100 shadow-slate-950/40"
            : "border-white/70 bg-white text-slate-900 shadow-indigo-200/80"
        } ${
          showScrollTop
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-75 opacity-0"
        }`}
      >
        <span
          className={`pointer-events-none absolute inset-0 rounded-full ${
            showScrollTop ? "animate-ping opacity-20" : "opacity-0"
          } ${isDark ? "bg-cyan-400" : "bg-indigo-400"}`}
        />
        <span
          className={`pointer-events-none absolute inset-[3px] rounded-full transition-all duration-500 ${
            isDark
              ? "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
              : "bg-gradient-to-br from-white via-indigo-50 to-cyan-100"
          } ${showScrollTop ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 text-white shadow-lg">
          <ChevronUp className="h-5 w-5" />
        </span>
      </button>
    </div>
  );
};

export default Discover;
