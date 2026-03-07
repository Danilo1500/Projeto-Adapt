import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import Loading from "../components/LoadingWhite";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import ProfileModal from "../components/ProfileModal";

const CompanyProfile = () => {
  // ---------------------------------------------------
  // DADOS DUMMY (EMPRESA, POSTS, SERVIÇOS, EQUIPE, PORTFÓLIO)
  // ---------------------------------------------------

  const dummyCompanyProfile = {
    id: "empresa123",
    name: "TechShield Segurança Digital",
    type: "Empresa",
    description:
      "Empresa especializada em soluções de cibersegurança, proteção de dados e defesa contra ataques digitais.",
    cover_photo:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
    profile_photo:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400",
    followers: 2340,
    following: 0,
    location: "São Paulo, Brasil",
    website: "https://techshield.com.br",
  };

  const dummyCompanyPosts = [
  {
    _id: "post01",
    content: "🚀 Lançamos nossa nova plataforma de análise avançada de ameaças cibernéticas! #cybersegurança #tech",
    createdAt: new Date(),
    image_urls: [
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600",
    ],
    likes_count: ["user01", "user02"], // sempre array
    user: {
      _id: "empresa123",
      full_name: "TechShield Segurança Digital",
      username: "techshield",
      profile_picture:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400",
    },
  },
  {
    _id: "post02",
    content: "📢 Participe do nosso Workshop Gratuito de Segurança Digital! #segurança",
    createdAt: new Date(Date.now() - 86400000),
    image_urls: [],
    likes_count: [],
    user: {
      _id: "empresa123",
      full_name: "TechShield Segurança Digital",
      username: "techshield",
      profile_picture:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400",
    },
  },
];


  const dummyServices = [
    {
      id: "s1",
      title: "Monitoramento 24/7",
      description:
        "Acompanhamento contínuo de redes e servidores para detectar ameaças em tempo real.",
      icon: "🛡️",
    },
    {
      id: "s2",
      title: "Auditoria de Segurança",
      description:
        "Avaliação completa da infraestrutura digital e identificação de vulnerabilidades.",
      icon: "🔍",
    },
    {
      id: "s3",
      title: "Pentest Profissional",
      description:
        "Testes de invasão éticos para identificar falhas antes que hackers reais encontrem.",
      icon: "💣",
    },
  ];

  const dummyTeam = [
    {
      id: "t1",
      name: "Marcos Andrade",
      role: "CEO & Fundador",
      photo: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: "t2",
      name: "Renata Souza",
      role: "Gerente de Segurança",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: "t3",
      name: "Carlos Becker",
      role: "Especialista em Redes",
      photo: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];

  const dummyPortfolio = [
    {
      id: "p1",
      title: "Sistema de Defesa para Banco Alfa",
      image:
        "https://images.unsplash.com/photo-1581091012184-5cbf73c5fd54?q=80&w=600",
      description:
        "Proteção total da infraestrutura bancária com IA de detecção de invasões.",
    },
    {
      id: "p2",
      title: "Firewall Inteligente para E-commerce X",
      image:
        "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=600",
      description:
        "Sistema avançado de firewall com análise de comportamento de usuários.",
    },
    {
      id: "p3",
      title: "Criptografia de Dados — Plataforma Y",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=600",
      description:
        "Implementação de criptografia de ponta a ponta para dados sensíveis.",
    },
  ];

  // ---------------------------------------------------
  // ESTADOS
  // ---------------------------------------------------

  const [company, setCompany] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  // ---------------------------------------------------
  // CARREGAMENTO DE DADOS LOCAIS
  // ---------------------------------------------------

  useEffect(() => {
  setCompany({
    ...dummyCompanyProfile,

    // MAPEAMENTO PARA O UserProfileInfo
    full_name: dummyCompanyProfile.name,
    username: dummyCompanyProfile.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ""), // cria automaticamente um username simples

    profile_picture: dummyCompanyProfile.profile_photo,

    // followers/following precisam ser ARRAY
    followers: Array(dummyCompanyProfile.followers).fill("x"),
    following: Array(dummyCompanyProfile.following).fill("x"),

    bio: dummyCompanyProfile.description, // adiciona bio corretamente
    createAt: new Date(), // evita erro do moment()
  });

  setPosts(dummyCompanyPosts);
}, []);


  // ---------------------------------------------------
  // RENDERIZAÇÃO
  // ---------------------------------------------------

  return company ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6 no-scrollbar">
      <div className="max-w-4xl mx-auto">
        {/* CARD PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {/* CAPA */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {company.cover_photo && (
              <img
                src={company.cover_photo}
                alt="cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* INFO DA EMPRESA */}
          <UserProfileInfo
            user={company}
            posts={posts}
            setShowEdit={setShowEdit}
            isCompany={true}
          />

          {/* BOTÃO TRABALHE CONOSCO */}
          <div className="p-4 text-center">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow">
              Trabalhe Conosco
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow p-1 flex max-w-xl mx-auto">
            {["posts", "media", "services", "team", "portfolio"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors cursor-pointer
                  ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* POSTS */}
          {activeTab === "posts" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.map((post) => (
  <PostCard key={post._id} post={post} />
))}
            </div>
          )}

          {/* MEDIA */}
          {activeTab === "media" && (
            <div className="flex flex-wrap mt-6 max-w-6xl">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .map((post) =>
                  post.image_urls.map((image, index) => (
                    <Link
                      to={image}
                      target="_blank"
                      key={index}
                      className="relative group"
                    >
                      <img
                        src={image}
                        className="w-64 aspect-video object-cover"
                        alt=""
                      />
                      <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                        Postado {moment(post.createdAt).fromNow()}
                      </p>
                    </Link>
                  ))
                )}
            </div>
          )}

          {/* SERVIÇOS */}
          {activeTab === "services" && (
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {dummyServices.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="text-3xl">{srv.icon}</div>
                  <h3 className="mt-2 font-semibold text-lg">{srv.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{srv.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* EQUIPE */}
          {activeTab === "team" && (
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {dummyTeam.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition text-center"
                >
                  <img
                    src={member.photo}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  <h3 className="mt-3 font-semibold">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          )}

          {/* PORTFÓLIO */}
          {activeTab === "portfolio" && (
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {dummyPortfolio.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition"
                >
                  <img
                    src={proj.image}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{proj.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {proj.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE EDIÇÃO */}
      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  ) : (
    <Loading />
  );
};

export default CompanyProfile;
