import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { dummyConnectionsData } from "../assets/assets";
import UserCard from "../components/UserCard";
import CompanyCard from "../components/CompanyCard";
import Loading from "../components/LoadingWhite";
import JobCard from "../jobCreation/components/JobCard";
import { dummyJobs } from "../jobCreation/data/dummyJobs";
import api from "../../api/axios";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../features/user/userSlice";
import toast from "react-hot-toast";

// Dados simulados de empresas (substitua depois pela API real)
const dummyCompaniesData = [
  {
    _id: "1",
    name: "TechNova Solutions",
    logo: "https://img.freepik.com/free-vector/modern-technology-logo-template_23-2149198725.jpg",
    industry: "Software Development",
    location: "São Paulo, BR",
    size: "51-200 funcionários",
    website: "https://technova.dev",
  },
  {
    _id: "2",
    name: "Cloudify Systems",
    logo: "https://img.freepik.com/free-vector/startup-logo-template_23-2149198742.jpg",
    industry: "Cloud Services",
    location: "Lisboa, PT",
    size: "11-50 funcionários",
    website: "https://cloudify.io",
  },
  {
    _id: "3",
    name: "GreenByte AI",
    logo: "https://img.freepik.com/free-vector/artificial-intelligence-logo_23-2149233816.jpg",
    industry: "Inteligência Artificial",
    location: "Curitiba, BR",
    size: "1-10 funcionários",
    website: "https://greenbyte.ai",
  },
];

const Discover = () => {

  const dispatch = useDispatch()
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState(dummyCompaniesData);
  const [jobs, setJobs] = useState(dummyJobs);
  const [loading, setLoading] = useState(false);
  const { getToken } =  useAuth()

  const tabs = ["vagas", "pessoas", "empresas"];
  const [activeTab, setActiveTab] = useState("pessoas");

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      try {
        setUsers([])
        setLoading(true)
        const { data } = await api.post('/api/user/discover', {input}, {
          headers: {Authorization: `Bearer ${await getToken()}` }
        })
        data.success ? setUsers(data.users) : toast.error(data.message)
        setLoading(false)
        setInput('')
      } catch (error) {
        toast.error(error.message)
      }
      setLoading(false)
    }
  }

  useEffect(()=>{
    getToken().then((token)=>{
      dispatch(fetchUser(token))
    })
  }, [])

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white no-scrollbar">
      <div className="max-w-6xl mx-auto p-6 pb-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Discover</h1>
          <p className="text-slate-600">
            Explore oportunidades, pessoas e empresas incríveis
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Buscar por ${
                  activeTab === "vagas"
                    ? "vaga, cargo ou empresa..."
                    : activeTab === "pessoas"
                    ? "nome, usuário ou localização..."
                    : "nome da empresa, setor ou cidade..."
                }`}
                className="pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && <Loading height="60vh" />}

        {/* Conteúdo das abas — só aparece se NÃO estiver carregando */}
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
                      onDelete={(id) =>
                        setJobs((prev) => prev.filter((j) => j.id !== id))
                      }
                    />
                  ))
                ) : (
                  <div className="text-center text-slate-500">
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
                    <CompanyCard key={company._id} company={company} />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center max-w-md mx-auto border border-gray-100">
                    <div className="text-gray-400 mb-2">
                      Nenhuma empresa encontrada
                    </div>
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
