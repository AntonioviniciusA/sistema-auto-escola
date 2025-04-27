import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { color, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Car,
  Clipboard,
  CreditCard,
  Database,
  FileText,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react";
import ViewSistema from "../../assets/ViewSistema.png";
import ViewVehicle from "../../assets/ViewVeihicle.png";
import ViewFinance from "../../assets/ViewFiance.png";
import "./landing.css";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Ajuste conforme necessário
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observar todas as seções
    const sections = [
      "home",
      "features",
      "financial",
      "fleet",
      "benefits",
      "technology",
      "contact",
    ];
    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className={`landing-page ${darkMode ? "dark-mode" : ""}`}>
      <nav className="navbar dark">
        <div className="navbar-container">
          <div className="logo">
            <span className="logo-text">Learn</span>
          </div>

          <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <li className={activeSection === "home" ? "active" : ""}>
              <a onClick={() => scrollToSection("home")}>Início</a>
            </li>
            <li className={activeSection === "features" ? "active" : ""}>
              <a onClick={() => scrollToSection("features")}>Funcionalidades</a>
            </li>
            <li className={activeSection === "financial" ? "active" : ""}>
              <a onClick={() => scrollToSection("financial")}>Financeiro</a>
            </li>
            <li className={activeSection === "fleet" ? "active" : ""}>
              <a onClick={() => scrollToSection("fleet")}>Frota</a>
            </li>
            <li className={activeSection === "benefits" ? "active" : ""}>
              <a onClick={() => scrollToSection("benefits")}>Benefícios</a>
            </li>
            <li className={activeSection === "technology" ? "active" : ""}>
              <a onClick={() => scrollToSection("technology")}>Tecnologia</a>
            </li>
            <li className={activeSection === "contact" ? "active" : ""}>
              <a onClick={() => scrollToSection("contact")}>Contato</a>
            </li>
          </ul>

          <div className="navbar-actions">
            {/* <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}

            <button className="login-button" onClick={handleLogin}>
              <User size={20} />
              <span>Login</span>
            </button>
            <div
              className={`mobile-menu-button ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </div>
            <div className="navbar-cta desktop">
              <button
                className="cta-button"
                onClick={() => scrollToSection("contact")}
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>AutoLearn: Transforme a Gestão da Sua Autoescola</h1>
            <p>
              Descubra o AutoLearn, o sistema SaaS que vai revolucionar a gestão
              da sua autoescola. Automatize processos, reduza custos e maximize
              a satisfação dos seus alunos.
            </p>
            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() => scrollToSection("features")}
              >
                Conheça as Funcionalidades
              </button>
              <button
                className="secondary-button"
                onClick={() => scrollToSection("contact")}
              >
                Solicitar Demonstração <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="hero-image">
            <motion.img
              src={ViewSistema}
              loading="lazy"
              alt="AutoLearn Dashboard"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Funcionalidades Essenciais para o Seu Sucesso</h2>
            <p>
              O AutoLearn oferece um conjunto completo de funcionalidades para
              otimizar a gestão da sua autoescola, desde o cadastro de alunos
              até o agendamento de aulas.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Clipboard />
              </div>
              <h3>Cadastro de Alunos</h3>
              <p>
                Registro rápido, documentação completa e histórico detalhado de
                cada aluno em um só lugar.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Calendar />
              </div>
              <h3>Agendamento Inteligente</h3>
              <p>
                Marcação de aulas flexível, calendário intuitivo e notificações
                automáticas para alunos e instrutores.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <LayoutDashboard />
              </div>
              <h3>Dashboard Completo</h3>
              <p>
                Visualize todas as informações importantes em um painel
                intuitivo e personalizável.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="financial" className="financial-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Controle Financeiro Simplificado</h2>
            <p>
              Tenha total controle sobre as finanças da sua autoescola, com
              ferramentas que facilitam o monitoramento de pagamentos e a gestão
              de receitas e despesas.
            </p>
          </div>

          <div className="container-finance">
            <div className="finance-image">
              <motion.img
                loading="lazy"
                src={ViewFinance}
                alt="AutoLearn Dashboard"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="finance-list">
              <div className="feature-item">
                <div className="feature-icon small">
                  <FileText />
                </div>
                <div className="feature-details">
                  <h3>Relatório de Pagamentos</h3>
                  <p>
                    Monitore atrasos e gere relatórios detalhados sobre a
                    situação financeira dos alunos.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon small">
                  <CreditCard />
                </div>
                <div className="feature-details">
                  <h3>Gerenciamento Financeiro</h3>
                  <p>
                    Controle receitas, despesas e exporte dados facilmente para
                    seu sistema contábil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fleet" className="fleet-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Frota Sempre em Dia</h2>
            <p>
              Mantenha sua frota sempre em perfeitas condições com o AutoLearn.
              Gerencie veículos, agende manutenções e controle custos de forma
              eficiente.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon small">
                  <Car />
                </div>
                <div className="feature-details">
                  <h3>Relatório de Veículos</h3>
                  <p>
                    Gestão completa da frota e controle de manutenções
                    preventivas e corretivas.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon small">
                  <CreditCard />
                </div>
                <div className="feature-details">
                  <h3>Controle de Custos</h3>
                  <p>
                    Acompanhe gastos com combustível, seguro e manutenção de
                    cada veículo da sua frota.
                  </p>
                </div>
              </div>
            </div>

            <div className="feature-image">
              <motion.img
                loading="lazy"
                src={ViewVehicle}
                alt="AutoLearn Dashboard"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="benefits-section">
        <div className="section-container">
          <div className="section-header">
            <h2 style={{ color: "white" }}>
              Benefícios que Impulsionam o Seu Crescimento
            </h2>
            <p>
              Descubra como o AutoLearn pode impulsionar o crescimento da sua
              autoescola, proporcionando mais eficiência, controle e satisfação.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Redução de Tempo</h3>
              <p>
                Automatize processos e economize tempo valioso da sua equipe
                para focar no que realmente importa.
              </p>
            </div>

            <div className="benefit-card">
              <h3>Controle Financeiro</h3>
              <p>
                Melhore o controle financeiro e previna a inadimplência com
                alertas e relatórios precisos.
              </p>
            </div>

            <div className="benefit-card">
              <h3>Gestão Eficiente</h3>
              <p>
                Otimize a gestão da frota e aumente a satisfação dos alunos com
                um sistema organizado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="technology" className="technology-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Tecnologia de Ponta para Resultados Reais</h2>
            <p>
              O AutoLearn é desenvolvido com as mais modernas tecnologias,
              garantindo desempenho, escalabilidade e segurança para o seu
              negócio.
            </p>
          </div>

          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-icon">
                <div className="tech-logo react"></div>
              </div>
              <h3>Frontend: React.js</h3>
              <p>
                Interface moderna e intuitiva para melhor experiência do
                usuário.
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">
                <div className="tech-logo node"></div>
              </div>
              <h3>Backend: Node.js</h3>
              <p>
                Desempenho e escalabilidade garantidos para sua autoescola
                crescer sem limites.
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">
                <div className="tech-logo mongo">
                  <Database size={30} />
                </div>
              </div>
              <h3>Banco de Dados: MongoDB</h3>
              <p>
                Flexibilidade e segurança dos dados da sua autoescola e seus
                alunos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section id="demo" className="demo-section">
        <div className="demo-container">
          <div className="demo-content">
            <h1>Descubra o Poder do AutoLearn na Prática</h1>
            <p>Veja como o AutoLearn se traduz em uma interface prática e intuitiva. Visualize seus recursos e agendamentos de maneira rápida e efetiva.</p>
            <div className="demo-buttons">
              <button className="demo-primary-button">Solicitar Demonstração</button>
              <button className="demo-secondary-button">Ver Tutorial <ArrowRight size={16} /></button>
            </div>
          </div>
          <div className="demo-image">
            <img loading="lazy" src="" alt="AutoLearn Dashboard" />
          </div>
        </div>
      </section> */}

      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-content">
            <h1>Pronto para Transformar Sua Autoescola?</h1>
            <p>
              Não perca tempo! Solicite um teste gratuito do AutoLearn e
              descubra como podemos ajudar você a transformar a gestão da sua
              autoescola.
            </p>
            <div className="contact-buttons">
              {/* <button className="contact-primary-button">Teste Grátis</button> */}
              <button className="contact-secondary-button">
                <a
                  href="https://wa.me/556196836619?text=Ol%C3%A1%2C%20gostaria%20de%20obter%20mais%20informações%20sobre%20o%20AutoLearn.%20Eu%20estou%20interessado%20em%20aprender%20mais%20sobre%20os%20recursos%20e%20benef%C3%ADcios%20do%20sistema."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Falar com consultor via WhatsApp"
                >
                  Falar com Consultor
                  <ArrowRight size={16} />
                </a>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <span className="logo-text">Learn</span>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Produto</h4>
              <ul>
                <li>
                  <a onClick={() => scrollToSection("features")}>
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("benefits")}>Benefícios</a>
                </li>
                <li>
                  <a onClick={() => scrollToSection("technology")}>
                    Tecnologia
                  </a>
                </li>
              </ul>
            </div>

            {/* <div className="footer-column">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#">Sobre nós</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Parceiros</a></li>
              </ul>
            </div> */}

            <div className="footer-column">
              <h4>Contato</h4>
              <ul>
                <li>
                  <a href="mailto:contato@autolearn.com">
                    contato@autolearn.com
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/556196836619">(61) 9683-6619</a>
                </li>
                <li>
                  <a href="https://wa.me/556196836619">Suporte</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} AutoLearn. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
