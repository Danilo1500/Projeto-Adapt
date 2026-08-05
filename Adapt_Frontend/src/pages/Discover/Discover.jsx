import React, { useEffect, useRef, useState } from "react";
import { ChevronUp, Search, Sparkles } from "lucide-react";
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
  const [recommendationsUsedAI, setRecommendationsUsedAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const scrollContainerRef = useRef(null);

  const tabs = ["vagas", "pessoas", "empresas"];
  const [activeTab, setActiveTab] = useState("pessoas");

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
    setRecommendationsUsedAI(false);
  };

  const fetchRecommendedJobs = async () => {
    const { data } = await requestWithAuth((headers) =>
      api.get("/api/job/recommended", { headers })
    );
    if (!data.success) throw new Error(data.message);
    const mapped = (data.jobs || []).map((job) => ({
      ...job,
      id: job._id || job.id,
      createdAt: job.createdAt ? new Date(job.createdAt) : undefined,
    }));
    setJobs(mapped);
    setJobSources({ internal: 0, external: 0 });
    setRecommendedMode(true);
    setRecommendationsUsedAI(Boolean(data.usedAI));
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
          className={`mb-8 rounded-md border shadow-md ${
            isDark ? "border-slate-700 bg-slate-800/80" : "border-slate-200/60 bg-white/80"
          }`}
        >
          <div className="p-6">
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

        {loading && <Loading height="45vh" size={48} />}

        {!loading && (
          <>
            {activeTab === "vagas" && (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className={isDark ? "text-sm text-slate-300" : "text-sm text-slate-600"}>
                    {recommendedMode
                      ? recommendationsUsedAI
                        ? "Vagas ordenadas pela analise de IA do seu portfolio."
                        : "Vagas ordenadas por compatibilidade tecnica basica."
                      : "Busque vagas ou gere recomendacoes com base no seu portfolio."}
                  </div>
                  <button
                    type="button"
                    onClick={handleRecommendedJobs}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    Recomendar com IA
                  </button>
                </div>

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
                  {jobs && jobs.length > 0 ? (
                    jobs.map((job) => (
                      <DiscoverJobCard
                        key={job.id}
                        job={job}
                      />
                    ))
                  ) : (
                    <div className={`text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Nenhuma vaga encontrada.
                    </div>
                  )}
                </div>
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
