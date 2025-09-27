import "./home.scss";
import { ArrowIcon } from "../components/arrow-icon";
import { Logo } from "../components/logo";
import { Comp } from "../components/comp";
import { LogoGiant } from "../components/logo-giant";
import { LogoGradient } from "../components/logo-gradient";
import { InstagramIcon } from "../components/instagram-icon";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import cat from "../assets/cat.png";
import mouse from "../assets/mouse.png";
import { useNavigate } from "react-router-dom"; 
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { FaArrowUp } from "react-icons/fa"; 

function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5 segundos
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loading />;

  return (
    <main className="home-background">
      <header className="header-container">
        <div className="text-start">
          <div className="text-adapt">
            <h1>Adapt</h1>
          </div>
          <div className="txt-ti">
            <h1>TI</h1>
          </div>
        </div>
        <nav className="menu-options">
          {/*<a>Serviços</a>*/}
          <a
            onClick={() => {
              document
                .getElementById("sobre-nos")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Sobre Nós
          </a>
          {/*<a>Contato</a>*/}
        </nav>
        <button onClick={() => navigate("/")}>
          <div className="btn-face-white">
            Entrar
            <ArrowIcon />
          </div>
          <div className="btn-face-purple">
            Entrar
            <ArrowIcon />
          </div>
        </button>
      </header>
      <div className="content-container">
        <div className="text-logo">
          <div className="init-text">
            <h1>
              Aqui você <br />
              cria o seu
              <br />
              futuro
            </h1>
            <h3>
              Junte-se a Adapt e consiga o <br />
              trabalho dos sonhos
            </h3>
          </div>
          <LogoGiant />
        </div>
      </div>
      <div className="down-container">
        <div className="content-box">
          <LogoGradient />
          <h3 className="content-title">
            A Adapt é a plataforma que deixa os programadores e as empresas{" "}
            <br />
            cara a cara. Se está interessado em ter um futuro brilhante e deseja
            <br />
            dar um pontapé na sua carreira, a Adapt é a plataforma perfeita para{" "}
            <br />
            você.
          </h3>
        </div>
        <hr className="divider-up" />
        <div className="content-youtube">
          <iframe
            width="100%"
            height="100%"
            src="#"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <hr className="divider-down" />
      </div>
      <div className="section-dupla" id="sobre-nos">
        <div className="dupla-box">
          <img src={img1} alt="Descrição" className="dupla-img-1" />
          <div className="dupla-text-1">
            A ADAPT é uma plataforma que agiliza a contratação de profissionais
            especializados, conectando empresas a talentos alinhados
            tecnicamente e culturalmente. Seus principais benefícios incluem
            economia de tempo, acesso a profissionais atualizados com as últimas
            tecnologias e suporte especializado. Além disso, oferece ferramentas
            inteligentes de filtragem e análise, otimizando todo o processo
            seletivo.
          </div>
        </div>
        <div className="dupla-center">
          <div className="dupla-line"></div>
          <div className="dupla-icon">
            <Comp />
          </div>
          <div className="dupla-line"></div>
        </div>
        <div className="dupla-box">
          <div className="dupla-text-2">
            O ADAPT é uma ótima opção para profissionais de TI em busca de
            crescimento e novas oportunidades. A plataforma conecta talentos
            qualificados a empresas que valorizam inovação e desenvolvimento.
            Entre os principais benefícios estão o acesso a vagas compatíveis
            com o perfil do candidato, processos seletivos mais diretos e
            recursos como perfis personalizados e recomendações automáticas, que
            aumentam a visibilidade e facilitam o encontro com as melhores
            oportunidades na área de tecnologia.
          </div>
          <img src={img2} alt="Descrição" className="dupla-img-2" />
        </div>
      </div>
      <div className="footer-content">
        <span className="footer-empresas">EMPRESAS</span>
        <span className="footer-interligadas"> Interligadas a </span>
        <span className="footer-profissionais">PROFISSIONAIS</span>
      </div>
      <div className="footer-banner">
        <div className="footer-instagram">
          <InstagramIcon />
          <span>@ADAPT2025</span>
        </div>
        <img src={cat} alt="Gato" className="footer-cat" />
        <img src={mouse} alt="Rato" className="footer-mouse" />
      </div>
      {/* Botão de voltar ao topo */}
      <button
        className="scroll-to-top"
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
      >
        <FaArrowUp />
      </button>
    </main>
  );
}

export default Home;
