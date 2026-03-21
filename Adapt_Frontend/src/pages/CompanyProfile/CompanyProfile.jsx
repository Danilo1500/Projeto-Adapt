import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

import Loading from "../components/LoadingWhite";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import CompanyProfileModal from "../components/CompanyProfileModal";
import api from "../../api/axios";

const dummyServices = [
  { id: "s1", title: "Monitoramento 24/7" },
  { id: "s2", title: "Auditoria de Seguranca" },
  { id: "s3", title: "Pentest Profissional" },
];

const CompanyProfile = () => {
  const { companyId } = useParams();
  const { getToken } = useAuth();

  const [company, setCompany] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const mapCompanyToProfile = (companyData) => {
    const members = Array.isArray(companyData?.members) ? companyData.members : [];
    const username = (companyData?.slug || companyData?.name || "empresa")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    return {
      ...companyData,
      full_name: companyData?.name || "Empresa",
      username: username || "empresa",
      profile_picture: companyData?.logo || "https://placehold.co/256x256?text=Empresa",
      cover_photo: companyData?.cover || "",
      followers: members,
      following: [],
      bio: companyData?.description || "Sem descricao cadastrada.",
      location: companyData?.location || "",
      createAt: companyData?.createdAt || new Date().toISOString(),
      website: companyData?.website || "",
      technologies: Array.isArray(companyData?.technologies) ? companyData.technologies : [],
      frameworks: Array.isArray(companyData?.frameworks) ? companyData.frameworks : [],
      members,
    };
  };

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const endpoint = companyId ? `/api/company/${companyId}` : "/api/company/my";
      const { data } = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.success || !data?.company) {
        toast.error(data?.message || "Nao foi possivel carregar a empresa.");
        setCompany(null);
        setPosts([]);
        return;
      }

      setCompany(mapCompanyToProfile(data.company));
      setPosts([]);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Erro ao carregar empresa.");
      setCompany(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [companyId, getToken]);

  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbar");
    document.body.classList.add("hide-scrollbar");
    return () => {
      document.documentElement.classList.remove("hide-scrollbar");
      document.body.classList.remove("hide-scrollbar");
    };
  }, []);

  const canEdit = !companyId;

  if (loading) return <Loading />;

  if (!company) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 p-6">
        <p className="text-sm text-gray-600">Empresa nao encontrada ou sem dados para exibir.</p>
      </div>
    );
  }

  const technologies =
    company.technologies.length > 0 ? company.technologies : dummyServices.map((item) => item.title);
  const team = company.members.length > 0 ? company.members : [];

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {company.cover_photo && (
              <img src={company.cover_photo} alt="cover" className="w-full h-full object-cover" />
            )}
          </div>

          <UserProfileInfo
            user={company}
            posts={posts}
            profileId={companyId}
            setShowEdit={setShowEdit}
          />

          <div className="p-4 text-center">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow">
              Trabalhe Conosco
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white rounded-xl shadow p-2 flex flex-wrap gap-2 max-w-xl mx-auto">
            {["posts", "media", "services", "team", "portfolio"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[90px] px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "posts" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              ) : (
                <p className="text-sm text-gray-500">Sem posts desta empresa ate o momento.</p>
              )}
            </div>
          )}

          {activeTab === "media" && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {posts
                .filter((post) => Array.isArray(post.image_urls) && post.image_urls.length > 0)
                .map((post) =>
                  post.image_urls.map((image, index) => (
                    <Link to={image} target="_blank" key={index} className="relative group">
                      <img src={image} className="w-full aspect-video object-cover rounded-lg" alt="" />
                      <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                        Postado {moment(post.createdAt).fromNow()}
                      </p>
                    </Link>
                  ))
                )}
            </div>
          )}

          {activeTab === "services" && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {technologies.map((tech, index) => (
                <div key={`${tech}-${index}`} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                  <div className="text-3xl">#</div>
                  <h3 className="mt-2 font-semibold text-lg">{tech}</h3>
                  <p className="text-gray-600 text-sm mt-1">Tecnologia utilizada pela empresa.</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "team" && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {team.length > 0 ? (
                team.map((member, index) => (
                  <div
                    key={member?._id || index}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition text-center"
                  >
                    <img
                      src={member?.profile_picture || "https://placehold.co/160x160?text=Membro"}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                      alt=""
                    />
                    <h3 className="mt-3 font-semibold">{member?.full_name || "Membro"}</h3>
                    <p className="text-gray-600 text-sm">@{member?.username || "membro"}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Sem membros para exibir.</p>
              )}
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {company.frameworks.length > 0 ? (
                company.frameworks.map((framework, index) => (
                  <div key={`${framework}-${index}`} className="bg-white rounded-xl shadow hover:shadow-lg transition">
                    <div className="p-4">
                      <h3 className="font-semibold">{framework}</h3>
                      <p className="text-gray-600 text-sm mt-1">Framework utilizado nos projetos da empresa.</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Sem portfolio para exibir.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {canEdit && showEdit && (
        <CompanyProfileModal company={company} setShowEdit={setShowEdit} onSaved={fetchCompany} />
      )}
    </div>
  );
};

export default CompanyProfile;
