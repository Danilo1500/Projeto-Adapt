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
  {
    id: "nodejs-guides", skills: ["node.js", "javascript"], title: "Introduction to Node.js", description: "Guia oficial da Node.js Foundation sobre execução de JavaScript no servidor, módulos, testes e ferramentas.", level: "Iniciante a intermediário", platform: "Node.js", url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs", cost: "Gratuito", type: "Guias oficiais",
    project: { title: "API REST com Node.js", description: "Implemente uma API HTTP com rotas, validação, erros, testes e persistência documentada.", technologies: ["Node.js", "JavaScript", "REST"], features: ["Rotas CRUD", "Validação de entrada", "Tratamento de erros", "Testes automatizados"] },
  },
  {
    id: "express-routing", skills: ["node.js", "express"], title: "Express - getting started", description: "Documentação oficial do Express para criar rotas, middlewares e aplicações web com Node.js.", level: "Iniciante", platform: "Express", url: "https://expressjs.com/en/starter/installing.html", cost: "Gratuito", type: "Documentação oficial",
    project: { title: "Servidor de catálogo", description: "Crie um servidor Express com autenticação simulada, rotas REST, middlewares e testes.", technologies: ["Express", "Node.js", "REST"], features: ["Rotas organizadas", "Middleware de validação", "Logs estruturados", "Testes de integração"] },
  },
  {
    id: "rest-mdn", skills: ["rest"], title: "An overview of HTTP", description: "Documentação da MDN sobre mensagens HTTP, métodos, códigos de status, cabeçalhos e semântica web.", level: "Iniciante", platform: "MDN Web Docs / Mozilla", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP", cost: "Gratuito", type: "Documentação oficial",
    project: { title: "Cliente e servidor REST", description: "Documente uma API, implemente recursos CRUD e trate autenticação, respostas e erros HTTP.", technologies: ["HTTP", "REST", "API"], features: ["Métodos semânticos", "Códigos de status", "Validação", "Documentação OpenAPI"] },
  },
  {
    id: "graphql-learn", skills: ["graphql"], title: "Introduction to GraphQL", description: "Introdução oficial ao modelo de consultas GraphQL, schemas, resolvers e execução de operações.", level: "Iniciante a intermediário", platform: "GraphQL Foundation", url: "https://graphql.org/learn/", cost: "Gratuito", type: "Documentação oficial",
    project: { title: "API GraphQL de projetos", description: "Modele consultas e mutations para projetos profissionais, usuários e competências.", technologies: ["GraphQL", "Node.js", "API"], features: ["Schema tipado", "Queries e mutations", "Validação", "Testes de resolvers"] },
  },
  {
    id: "postgresql-tutorial", skills: ["sql", "postgresql"], title: "PostgreSQL Tutorial", description: "Tutorial oficial do PostgreSQL sobre tabelas, consultas, funções, índices e transações.", level: "Iniciante a intermediário", platform: "PostgreSQL", url: "https://www.postgresql.org/docs/current/tutorial.html", cost: "Gratuito", type: "Tutorial oficial",
    project: { title: "Modelagem de um portfólio profissional", description: "Modele usuários, competências, projetos e vagas relacionais com consultas e migrações documentadas.", technologies: ["PostgreSQL", "SQL"], features: ["Modelo normalizado", "Migrações", "Índices", "Consultas de relatório"] },
  },
  {
    id: "kubernetes-basics", skills: ["kubernetes"], title: "Learn Kubernetes Basics", description: "Tutorial oficial com conceitos de clusters, pods, deployments, serviços e escalabilidade.", level: "Iniciante", platform: "Kubernetes", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", cost: "Gratuito", type: "Tutorial oficial",
    project: { title: "Aplicação disponível em Kubernetes", description: "Empacote uma aplicação, publique manifests básicos e configure escalabilidade e serviço.", technologies: ["Kubernetes", "Docker", "YAML"], features: ["Deployment e Service", "ConfigMaps", "Logs e diagnóstico", "Manifestos documentados"] },
  },
  {
    id: "terraform-tutorials", skills: ["terraform"], title: "Get Started with Terraform", description: "Tutoriais oficiais da HashiCorp para escrever, validar, aplicar e versionar infraestrutura como código.", level: "Iniciante a intermediário", platform: "HashiCorp Developer", url: "https://developer.hashicorp.com/terraform/tutorials", cost: "Gratuito", type: "Trilha oficial",
    project: { title: "Infraestrutura reproduzível", description: "Descreva recursos de laboratório declarativamente, execute revisões de plano e documente o estado.", technologies: ["Terraform", "IaC", "Cloud"], features: ["Variáveis", "Módulos", "Plano e aplicação", "README de execução"] },
  },
  {
    id: "google-cloud-get-started", skills: ["gcp"], title: "Get started with Google Cloud", description: "Central oficial de introdução aos conceitos, serviços, ferramentas e primeiros projetos no Google Cloud.", level: "Iniciante", platform: "Google Cloud", url: "https://cloud.google.com/docs/get-started", cost: "Há recursos gratuitos", type: "Documentação oficial",
    project: { title: "Aplicação web no Google Cloud", description: "Documente uma arquitetura pequena com implantação, armazenamento e monitoramento básico.", technologies: ["Google Cloud", "Cloud Run", "Observabilidade"], features: ["Arquitetura", "Deploy documentado", "Logs", "Controle de custos"] },
  },
  {
    id: "github-actions", skills: ["ci/cd", "git"], title: "Understanding GitHub Actions", description: "Documentação oficial do GitHub para construir workflows de integração contínua e entrega automatizada.", level: "Iniciante a intermediário", platform: "GitHub Docs", url: "https://docs.github.com/en/actions/about-github-actions/understanding-github-actions", cost: "Gratuito", type: "Documentação oficial",
    project: { title: "Pipeline de testes e build", description: "Crie um workflow que execute testes, validações e build em pull requests.", technologies: ["GitHub Actions", "CI/CD", "Git"], features: ["Jobs e gatilhos", "Cache de dependências", "Relatório de testes", "Proteção de branch"] },
  },
  {
    id: "owasp-wstg", skills: ["cybersecurity"], title: "OWASP Web Security Testing Guide", description: "Guia aberto da OWASP para planejamento e execução de testes de segurança em aplicações web.", level: "Intermediário", platform: "OWASP", url: "https://owasp.org/www-project-web-security-testing-guide/", cost: "Gratuito", type: "Guia aberto oficial",
    project: { title: "Checklist de segurança de aplicação web", description: "Avalie uma aplicação de demonstração contra riscos documentados e registre correções verificáveis.", technologies: ["Segurança web", "OWASP", "Pentest básico"], features: ["Threat modeling", "Controles de acesso", "Validação", "Relatório técnico"] },
  },
  {
    id: "nextjs-learn", skills: ["nextjs", "react"], title: "Learn Next.js", description: "Curso oficial do Next.js sobre rotas, layouts, dados, autenticação e implantação.", level: "Iniciante a intermediário", platform: "Next.js", url: "https://nextjs.org/learn", cost: "Gratuito", type: "Curso oficial",
    project: { title: "Aplicação full-stack no Next.js", description: "Construa uma aplicação com rotas dinâmicas, dados persistidos, autenticação e testes.", technologies: ["Next.js", "React", "TypeScript"], features: ["Rotas dinâmicas", "Server Actions", "Autenticação", "Deploy documentado"] },
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
