import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import UserCard from "../components/UserCard";
import CompanyCard from "../components/CompanyCard";
import Loading from "../components/LoadingWhite";
import JobCard from "../jobCreation/components/JobCard";
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
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const tabs = ["vagas", "pessoas", "empresas"];
  const [activeTab, setActiveTab] = useState("pessoas");

  const fetchUsers = async (searchText = "") => {
    const token = await getToken();
    const { data } = await api.post(
      "/api/user/discover",
      { input: searchText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!data.success) throw new Error(data.message);
    setUsers(data.users || []);
  };

  const fetchCompanies = async (searchText = "") => {
    const token = await getToken();
    const { data } = await api.get("/api/company/list", {
      params: { q: searchText },
      headers: { Authorization: `Bearer ${token}` },
    });
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
      id: job._id,
      createdAt: job.createdAt ? new Date(job.createdAt) : undefined,
    }));
    setJobs(mapped);
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

  const handleJoinCompany = async (companyId) => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/company/${companyId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
  }, [activeTab]);

  return (
    <div
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
              <div className="flex flex-wrap gap-6">
                {jobs && jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onApply={() => {}}
                    />
                  ))
                ) : (
                  <div className={`text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Nenhuma vaga encontrada.
                  </div>
                )}
              </div>
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
    </div>
  );
};

export default Discover;
