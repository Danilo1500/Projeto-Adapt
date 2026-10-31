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
  {
    id: "vitest-guide", skills: ["vitest", "testing"], title: "Vitest Getting Started", description: "Guia oficial para configurar Vitest, executar testes unitários e utilizar recursos modernos de execução.", level: "Intermediário", language: "Inglês", platform: "Vitest", url: "https://vitest.dev/guide/", cost: "Gratuito", type: "Guia oficial",
    project: { title: "Cobertura de testes com Vitest", description: "Adicione testes unitários e de integração a regras de negócio e componentes de uma aplicação.", technologies: ["Vitest", "JavaScript", "TypeScript"], features: ["Testes unitários", "Mocks", "Cobertura", "Integração contínua"] },
  },
  {
    id: "figma-help", skills: ["figma"], title: "Figma Help Center", description: "Documentação oficial de interface, componentes, protótipos e colaboração no Figma.", level: "Iniciante a avançado", language: "Inglês", platform: "Figma", url: "https://help.figma.com/hc/en-us", cost: "Gratuito", type: "Documentação oficial",
    project: { title: "Protótipo navegável de produto", description: "Modele componentes reutilizáveis e um fluxo navegável alinhado às telas da aplicação.", technologies: ["Figma", "UI Design", "Prototipagem"], features: ["Design system básico", "Componentes", "Protótipo", "Handoff documentado"] },
  },
  {
    id: "pandas-docs", skills: ["pandas", "python"], title: "Pandas Getting Started", description: "Documentação oficial para começar a analisar dados com estruturas, operações e leitura de arquivos em Pandas.", level: "Iniciante a intermediário", language: "Inglês", platform: "Pandas", url: "https://pandas.pydata.org/docs/getting_started/index.html", cost: "Gratuito", type: "Documentação oficial",
    project: { title: "Análise exploratória com Pandas", description: "Limpe, transforme, agregue e visualize um conjunto de dados público.", technologies: ["Python", "Pandas", "Jupyter"], features: ["Leitura de dados", "Limpeza", "Agrupamentos", "Relatório reproduzível"] },
  },
  {
    id: "power-bi-get-started", skills: ["power bi", "data analysis"], title: "Power BI Get Started", description: "Documentação oficial da Microsoft para importar dados, criar modelos e publicar relatórios.", level: "Iniciante", language: "Inglês", platform: "Microsoft Learn", url: "https://learn.microsoft.com/power-bi/", cost: "Há recursos gratuitos; verifique o plano", type: "Documentação oficial e trilhas Microsoft Learn",
    project: { title: "Painel de indicadores", description: "Importe dados, crie relações e publique um painel com indicadores verificáveis.", technologies: ["Power BI", "SQL", "DAX"], features: ["Modelo de dados", "Medidas", "Visualizações", "Filtros"] },
  },
  {
    id: "cypress-guide", skills: ["cypress", "testing"], title: "Cypress App Core Concepts", description: "Documentação oficial para escrever, executar e depurar testes end-to-end em aplicações web.", level: "Iniciante a intermediário", language: "Inglês", platform: "Cypress", url: "https://docs.cypress.io/app/get-started/why-cypress", cost: "Gratuito; recursos empresariais podem variar", type: "Documentação oficial",
    project: { title: "Testes end-to-end de fluxo web", description: "Automatize login, navegação, formulários e estados de erro em uma aplicação de demonstração.", technologies: ["Cypress", "JavaScript", "Testing"], features: ["Testes de fluxo", "Asserções", "Interceptação", "Relatório"] },
  },
  {
    id: "postman-learning", skills: ["postman", "api testing"], title: "Postman Learning Center", description: "Centro oficial de aprendizagem para criar requisições, coleções, testes e automações de APIs.", level: "Iniciante a intermediário", language: "Inglês", platform: "Postman", url: "https://learning.postman.com/docs/introduction/overview/", cost: "Há recursos gratuitos; recursos pagos podem variar", type: "Trilhas e documentação oficial",
    project: { title: "Coleção de testes de API", description: "Valide autenticação, respostas, erros e contratos de uma API por meio de uma coleção executável.", technologies: ["Postman", "REST API", "JSON"], features: ["Coleção", "Variáveis", "Testes de resposta", "Runner automatizado"] },
  },
  {
    id: "github-actions-docs", skills: ["github actions", "ci/cd", "git"], title: "GitHub Actions Documentation", description: "Documentação oficial para construir workflows de automação, testes, builds e deploys.", level: "Iniciante a intermediário", language: "Inglês", platform: "GitHub Docs", url: "https://docs.github.com/en/actions", cost: "Gratuito; consumo de minutos pode variar", type: "Documentação oficial",
    project: { title: "Pipeline GitHub Actions", description: "Crie um workflow que instale dependências, execute testes e valide o build em pull requests.", technologies: ["GitHub Actions", "CI/CD", "Git"], features: ["Triggers", "Jobs", "Cache", "Artifacts"] },
  },
  {
    id: "react-native-docs", skills: ["react native", "javascript", "react"], title: "React Native Getting Started", description: "Documentação oficial para configurar o ambiente e construir interfaces móveis com React Native.", level: "Iniciante a intermediário", language: "Inglês", platform: "React Native", url: "https://reactnative.dev/docs/getting-started", cost: "Gratuito", type: "Documentação oficial",
    project: { title: "Aplicativo móvel de tarefas", description: "Implemente uma interface móvel com navegação, estados, persistência simples e testes.", technologies: ["React Native", "JavaScript", "REST"], features: ["Navegação", "Componentes nativos", "Persistência", "Consumir API"] },
  },
  {
    id: "spring-guides", skills: ["spring", "java", "rest"], title: "Spring Boot Guides", description: "Guias oficiais da Spring para criar aplicações, serviços REST, persistência e configuração.", level: "Iniciante a intermediário", language: "Inglês", platform: "Spring", url: "https://spring.io/guides", cost: "Gratuito", type: "Guias oficiais",
    project: { title: "API REST com Spring Boot", description: "Implemente uma API REST com validação, persistência, testes e documentação.", technologies: ["Java", "Spring Boot", "SQL"], features: ["Controllers REST", "Persistência", "Validação", "Testes de integração"] },
  },
  {
    id: "django-tutorial", skills: ["django", "python", "rest"], title: "Django Writing Your First App", description: "Tutorial oficial para criar uma aplicação Django, modelos, views, templates e testes.", level: "Iniciante a intermediário", language: "Inglês", platform: "Django", url: "https://docs.djangoproject.com/en/stable/intro/tutorial01/", cost: "Gratuito", type: "Tutorial oficial",
    project: { title: "Aplicação web Django", description: "Crie uma aplicação completa com autenticação, modelos, formulários, testes e administração.", technologies: ["Python", "Django", "PostgreSQL"], features: ["Models", "Views", "Forms", "Admin"] },
  },
  {
    id: "linux-command-line", skills: ["linux"], title: "The Linux Command Line for Beginners", description: "Tutorial oficial da Ubuntu para navegar no sistema, manipular arquivos e executar comandos essenciais.", level: "Iniciante", language: "Inglês", platform: "Ubuntu", url: "https://ubuntu.com/tutorials/command-line-for-beginners", cost: "Gratuito", type: "Tutorial oficial",
    project: { title: "Ambiente de desenvolvimento Linux", description: "Configure ferramentas, permissões, processos e scripts de automação em uma máquina Linux.", technologies: ["Linux", "Shell", "Docker"], features: ["Sistema de arquivos", "Permissões", "Processos", "Scripts shell"] },
  },
  {
    id: "postgresql-backup", skills: ["postgresql", "sql", "backup", "indices", "modelagem de dados"], title: "PostgreSQL Backup and Restore", description: "Documentação oficial sobre estratégias de backup, recuperação lógica, manutenção e operação de PostgreSQL.", level: "Intermediário a avançado", language: "Inglês", platform: "PostgreSQL", url: "https://www.postgresql.org/docs/current/backup.html", cost: "Gratuito", type: "Documentação oficial",
    project: { title: "Plano de backup de banco PostgreSQL", description: "Implemente backups, restauração documentada, índices e procedimentos operacionais para um banco de demonstração.", technologies: ["PostgreSQL", "SQL", "Backup"], features: ["Dump lógico", "Restauração", "Rotação", "Validação"] },
  },
];

export const findCoursesForSkills = (skills = []) => {
  const normalizedSkills = new Set(skills.map((skill) => String(skill).toLowerCase().trim()));
  return LEARNING_RESOURCES
    .filter((resource) => resource.skills.some((skill) => normalizedSkills.has(skill)))
    .map((resource) => ({
      ...resource,
      provider: resource.provider || resource.platform,
      relatedSkills: resource.skills.filter((skill) => normalizedSkills.has(skill)),
      reason: `Material oficial para desenvolver ${resource.skills.filter((skill) => normalizedSkills.has(skill)).join(", ")}.`,
    }));
};

export const getCourseCatalog = () => LEARNING_RESOURCES.map((resource) => ({
  ...resource,
  provider: resource.provider || resource.platform,
}));
