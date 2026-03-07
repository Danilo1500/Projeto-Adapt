import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import UserCard from "../components/UserCard";
import CompanyCard from "../components/CompanyCard";
import Loading from "../components/LoadingWhite";
import JobCard from "../jobCreation/components/JobCard";
import { dummyJobs } from "../jobCreation/data/dummyJobs";
import api from "../../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const Discover = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState(dummyJobs);
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

  const handleSearch = async (event) => {
    if (event.key !== "Enter") return;
    try {
      setLoading(true);
      if (activeTab === "pessoas") {
        await fetchUsers(input);
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
    <div className="h-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white no-scrollbar">
      <div className="mx-auto max-w-6xl p-6 pb-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Discover</h1>
          <p className="text-slate-600">Explore oportunidades, pessoas e empresas incriveis</p>
        </div>

        <div className="mb-6 flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 cursor-pointer rounded-xl px-4 py-2.5 transition-all duration-200 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="mb-8 rounded-md border border-slate-200/60 bg-white/80 shadow-md">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
              <input
                type="text"
                placeholder={`Buscar por ${
                  activeTab === "vagas"
                    ? "vaga, cargo ou empresa..."
                    : activeTab === "pessoas"
                    ? "nome, usuario ou localizacao..."
                    : "nome da empresa, setor ou cidade..."
                }`}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 sm:pl-12 max-sm:text-sm"
                onChange={(event) => setInput(event.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>

        {loading && <Loading height="60vh" />}

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
                      onDelete={(id) => setJobs((prev) => prev.filter((item) => item.id !== id))}
                    />
                  ))
                ) : (
                  <div className="text-center text-slate-500">Nenhuma vaga encontrada.</div>
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
                  <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-md">
                    <div className="mb-2 text-gray-400">Nenhuma empresa encontrada</div>
                    <p className="text-gray-500">Tente pesquisar novamente</p>
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
