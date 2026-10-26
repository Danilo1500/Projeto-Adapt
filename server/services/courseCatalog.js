// Curated learning resources. Each entry points to its publisher's official
// learning material; this catalog intentionally does not claim certificates.
const LEARNING_RESOURCES = [
  {
    id: "typescript-handbook",
    skills: ["typescript"],
    title: "The TypeScript Handbook",
    description: "Manual oficial para aprender os fundamentos e aplicar TypeScript em projetos JavaScript.",
    level: "Intermediário (recomenda JavaScript básico)", platform: "TypeScript / Microsoft", url: "https://www.typescriptlang.org/docs/handbook/", cost: "Gratuito", type: "Manual oficial",
    project: { title: "Gerenciador de tarefas tipado", description: "Crie uma aplicação de tarefas com tipos de domínio, validação de formulário e estados explícitos.", technologies: ["TypeScript", "React", "Vitest"], features: ["CRUD de tarefas", "Validação", "Componentes reutilizáveis", "Testes e README"] },
  },
  {
    id: "mdn-first-website",
    skills: ["html", "css", "javascript"],
    title: "Your first website",
    description: "Módulo oficial da MDN com construção de uma página, conteúdo HTML, estilos CSS, interatividade e publicação.",
    level: "Iniciante", platform: "MDN Web Docs / Mozilla", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web", cost: "Gratuito", type: "Trilha de aprendizagem",
    project: { title: "Portfólio web responsivo", description: "Construa um site pessoal acessível, responsivo e publicado, com conteúdo semântico e interações pequenas.", technologies: ["HTML", "CSS", "JavaScript", "GitHub Pages"], features: ["Seções de perfil e projetos", "Layout responsivo", "Formulário validado", "Publicação e README"] },
  },
  {
    id: "pro-git-book",
    skills: ["git"],
    title: "Pro Git — livro oficial",
    description: "Livro completo sobre controle de versão com Git, disponível online e com tradução para português do Brasil.",
    level: "Iniciante a avançado", platform: "Git project", url: "https://git-scm.com/book/pt-br/v2", cost: "Gratuito", type: "Livro online",
    project: { title: "Portfólio versionado no GitHub", description: "Publique um projeto com histórico de commits claro, branches, issues e instruções de contribuição.", technologies: ["Git", "GitHub", "Markdown"], features: ["Commits pequenos e descritivos", "Branches e pull requests", "README com instalação e demonstração", "Histórico público do projeto"] },
  },
  {
    id: "react-quick-start",
    skills: ["react"],
    title: "Quick Start",
    description: "Introdução oficial aos componentes, dados, eventos e estado do React.",
    level: "Iniciante", platform: "React.dev", url: "https://react.dev/learn", cost: "Gratuito", type: "Tutorial oficial",
    project: { title: "Painel de oportunidades", description: "Crie uma interface React que consome uma API e permite filtrar e salvar oportunidades.", technologies: ["React", "TypeScript", "API REST"], features: ["Busca e filtros", "Estados de carregamento e erro", "Testes de componentes", "README com decisões técnicas"] },
  },
  {
    id: "react-testing-library",
    skills: ["testing", "react"],
    title: "React Testing Library — Introduction",
    description: "Documentação introdutória oficial para testar componentes React pela perspectiva de uso da interface.",
    level: "Intermediário (recomenda fundamentos de React)", platform: "Testing Library", url: "https://testing-library.com/docs/react-testing-library/intro/", cost: "Gratuito", type: "Documentação e tutorial",
    project: { title: "Suíte de testes de interface", description: "Adicione testes a um fluxo real de formulário, validação, carregamento, erro e interação do usuário.", technologies: ["React", "Testing Library", "Vitest"], features: ["Testes acessíveis por rótulo", "Casos de sucesso e erro", "Teste de interação", "Comando de execução no README"] },
  },
  {
    id: "docker-get-started", skills: ["docker"], title: "Get started with Docker", description: "Tutoriais oficiais para criar e compartilhar uma aplicação em contêiner.", level: "Iniciante", platform: "Docker Docs", url: "https://docs.docker.com/get-started/", cost: "Gratuito", type: "Trilha de aprendizagem",
    project: { title: "Aplicação conteinerizada", description: "Empacote uma aplicação e documente sua execução em um ambiente reproduzível.", technologies: ["Docker", "Node.js", "Docker Compose"], features: ["Dockerfile", "Configuração de ambiente", "Health check", "README de execução"] },
  },
  {
    id: "azure-cloud-concepts", skills: ["azure"], title: "Introduction to Cloud Infrastructure: Describe cloud concepts", description: "Trilha oficial de conceitos básicos de nuvem e visão geral do Azure.", level: "Iniciante", duration: "56 min", platform: "Microsoft Learn", url: "https://learn.microsoft.com/training/paths/azure-fundamentals/", cost: "Gratuito", type: "Trilha de aprendizagem",
    project: { title: "Aplicação preparada para nuvem", description: "Documente uma arquitetura simples para uma aplicação web e faça um deploy de demonstração.", technologies: ["Azure", "App Service", "Azure Monitor"], features: ["Diagrama de arquitetura", "Configuração documentada", "Monitoramento básico", "README de deploy"] },
  },
  {
    id: "aws-skill-builder", skills: ["aws"], title: "AWS Skill Builder: digital training", description: "Catálogo oficial de cursos digitais autoguiados; disponibilidade e acesso variam por curso.", level: "Vários níveis", platform: "AWS Skill Builder", url: "https://aws.amazon.com/training/digital/", cost: "Há cursos gratuitos", type: "Catálogo oficial de cursos",
    project: { title: "API serverless", description: "Implemente e documente uma API pequena com controles básicos e observabilidade.", technologies: ["AWS", "API Gateway", "Lambda"], features: ["Endpoints CRUD", "Persistência", "Logs", "Documentação de arquitetura"] },
  },
  {
    id: "mongodb-university", skills: ["mongodb"], title: "MongoDB University: cursos e treinamentos", description: "Catálogo oficial de cursos e materiais de MongoDB; formatos e disponibilidade variam.", level: "Vários níveis", platform: "MongoDB University", url: "https://learn.mongodb.com/", cost: "Há cursos gratuitos", type: "Catálogo oficial de cursos",
    project: { title: "API de catálogo com MongoDB", description: "Construa uma API com persistência, validação e consultas documentadas.", technologies: ["MongoDB", "Node.js", "REST"], features: ["CRUD com validação", "Índices e paginação", "Testes automatizados", "Documentação dos endpoints"] },
  },
  {
    id: "python-tutorial", skills: ["python"], title: "The Python Tutorial", description: "Tutorial oficial da linguagem para quem já tem noções de programação.", level: "Intermediário para quem está começando em Python", platform: "Python.org", url: "https://docs.python.org/3/tutorial/", cost: "Gratuito", type: "Tutorial oficial",
    project: { title: "Analisador de dados abertos", description: "Crie um pipeline reprodutível que limpa, analisa e apresenta um conjunto de dados público.", technologies: ["Python", "Jupyter", "Pandas"], features: ["Validação de entrada", "Notebook reproduzível", "Visualizações", "README com fonte dos dados"] },
  },
];

export const findCoursesForSkills = (skills = []) => {
  const normalizedSkills = new Set(skills.map((skill) => String(skill).toLowerCase().trim()));
  return LEARNING_RESOURCES
    .filter((resource) => resource.skills.some((skill) => normalizedSkills.has(skill)))
    .map((resource) => ({
      ...resource,
      relatedSkills: resource.skills.filter((skill) => normalizedSkills.has(skill)),
      reason: `Material oficial para desenvolver ${resource.skills.filter((skill) => normalizedSkills.has(skill)).join(", ")}.`,
    }));
};

export const getCourseCatalog = () => LEARNING_RESOURCES.map((resource) => ({ ...resource }));
