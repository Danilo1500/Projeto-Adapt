import React, { useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./Language.js";
const STORAGE_KEY = "adapt-language";

// UI labels and messages shared across the app. Text nodes and common accessible
// attributes are translated so pages and dynamically opened dialogs follow the setting.
const portugueseToEnglish = {
  "Configurações":"Settings", "Configuração":"Settings", "Fechar":"Close", "Salvar":"Save", "Cancelar":"Cancel", "Enviar":"Send", "Excluir":"Delete", "Editar":"Edit", "Criar":"Create", "Buscar":"Search", "Pesquisar":"Search", "Carregando":"Loading", "Voltar":"Back", "Continuar":"Continue", "Próximo":"Next", "Anterior":"Previous", "Concluir":"Finish", "Entrar":"Sign in", "Sair":"Sign out", "Perfil":"Profile", "Início":"Home", "Inicio":"Home", "Vagas":"Jobs", "Pessoas":"People", "Empresas":"Companies", "Conexões":"Connections", "Notificações":"Notifications", "Mensagens":"Messages", "Publicações":"Posts", "Publicação":"Post", "Criar publicação":"Create post", "Criar Vaga":"Create job", "Criar Empresa":"Create company", "Descobrir":"Discover", "Tema":"Theme", "Temas":"Theme", "Idioma":"Language", "Claro":"Light", "Escuro":"Dark", "Minha rede":"My network", "Ver perfil":"View profile", "Ver mais":"See more", "Mostrar mais":"Show more", "Mostrar menos":"Show less", "Ver todos":"See all", "Todos":"All", "Todas":"All", "Nenhum":"None", "Nenhuma":"None", "Sim":"Yes", "Não":"No", "Salvar alterações":"Save changes", "Atualizar":"Update", "Atualizado":"Updated", "Compartilhar":"Share", "Comentar":"Comment", "Curtir":"Like", "Gostei":"Liked", "Seguir":"Follow", "Seguindo":"Following", "Conectar":"Connect", "Conectado":"Connected", "Aceitar":"Accept", "Recusar":"Decline", "Rejeitar":"Reject", "Pendente":"Pending", "Enviar mensagem":"Send message", "Escreva uma mensagem":"Write a message", "Escreva um comentário":"Write a comment", "Adicionar":"Add", "Remover":"Remove", "Anexar":"Attach", "Foto":"Photo", "Imagem":"Image", "Vídeo":"Video", "Sobre":"About", "Experiência":"Experience", "Formação":"Education", "Habilidades":"Skills", "Localização":"Location", "Empresa":"Company", "Cargo":"Job title", "Descrição":"Description", "Título":"Title", "Nome":"Name", "Email":"Email", "Telefone":"Phone", "Senha":"Password", "Confirmar senha":"Confirm password", "Salvar perfil":"Save profile", "Editar perfil":"Edit profile", "Sobre mim":"About me", "Nome completo":"Full name", "Nome de usuário":"Username", "Usuário":"User", "Usuários":"Users", "Candidatar-se":"Apply", "Candidatura":"Application", "Candidatos":"Applicants", "Tipo de trabalho":"Work type", "Remoto":"Remote", "Híbrido":"Hybrid", "Presencial":"On-site", "Tempo integral":"Full time", "Meio período":"Part time", "Estágio":"Internship", "Salário":"Salary", "Benefícios":"Benefits", "Requisitos":"Requirements", "Responsabilidades":"Responsibilities", "Publicar vaga":"Post job", "Vaga":"Job", "Vaga salva":"Job saved", "Vagas salvas":"Saved jobs", "Nenhuma vaga encontrada":"No jobs found", "Nenhum resultado encontrado":"No results found", "Nenhuma publicação encontrada":"No posts found", "Nenhuma mensagem":"No messages", "Comece uma conversa":"Start a conversation", "Bem-vindo":"Welcome", "Bem-vinda":"Welcome", "Olá":"Hello", "Obrigado":"Thank you", "Obrigada":"Thank you", "Hoje":"Today", "Ontem":"Yesterday", "Agora":"Now", "Recentes":"Recent", "Popular":"Popular", "Recomendado":"Recommended", "Recomendações":"Recommendations", "Filtros":"Filters", "Filtrar":"Filter", "Ordenar por":"Sort by", "Data":"Date", "Categoria":"Category", "Todas as categorias":"All categories", "Selecionar":"Select", "Selecionar arquivo":"Choose file", "Nenhum arquivo selecionado":"No file selected", "Carregar mais":"Load more", "Tentar novamente":"Try again", "Algo deu errado":"Something went wrong", "Ocorreu um erro":"An error occurred", "Sucesso":"Success", "Erro":"Error", "Atenção":"Warning", "Administração":"Administration", "Painel administrativo":"Admin dashboard", "Denunciar":"Report", "Bloquear":"Block", "Desbloquear":"Unblock", "Cancelar inscrição":"Unsubscribe", "Conta":"Account", "Privacidade":"Privacy", "Ajuda":"Help", "Termos de uso":"Terms of service", "Política de privacidade":"Privacy policy", "Criar conta":"Create account", "Não tem uma conta?":"Don't have an account?", "Já tem uma conta?":"Already have an account?", "Entrar com Google":"Sign in with Google", "Entrar com Microsoft":"Sign in with Microsoft", "Conecte-se":"Sign in", "Junte-se":"Join", "Etapa":"Step", "Detalhes":"Details", "Informações básicas":"Basic information", "Revisar":"Review", "Publicar":"Publish", "Rascunho":"Draft", "Ativo":"Active", "Inativo":"Inactive", "Aberto":"Open", "Fechado":"Closed", "Atualizado há pouco":"Updated recently", "Nenhuma conexão ainda":"No connections yet", "Descubra pessoas":"Discover people", "Conectar-se":"Connect", "Criar história":"Create story", "Adicionar história":"Add story", "Sua história":"Your story", "Visualizações":"Views", "Ver publicações":"View posts", "Todos os direitos reservados":"All rights reserved", "Desenvolvido por":"Powered by", "Saiba mais":"Learn more", "Como funciona":"How it works", "Depoimentos":"Testimonials", "Comece agora":"Get started", "Encontre oportunidades":"Find opportunities", "Para profissionais":"For professionals", "Para empresas":"For companies", "Inovação":"Innovation", "Desenvolvimento":"Development", "Segurança":"Security", "Dados e IA":"Data and AI", "Cloud e DevOps":"Cloud and DevOps", "Front-end":"Front-end", "Back-end":"Back-end", "Full stack":"Full stack", "Tipo":"Type", "Detalhe da vaga":"Job details", "Sobre a empresa":"About the company", "Criar uma empresa":"Create a company", "Nome da empresa":"Company name", "Site":"Website", "Endereço":"Address", "Endereço de e-mail":"Email address", "Mensagem":"Message",  "Recrutador":"Recruiter", "Profissional":"Professional", "Profissionais":"Professionals", "Conexão":"Connection", "Publicar atualização":"Post an update", "O que você está pensando?":"What are you thinking?", "Escreva algo":"Write something", "Adicionar foto":"Add photo", "Adicionar vídeo":"Add video", "Sem resultados":"No results", "Ver detalhes":"View details", "Aplicar agora":"Apply now", "Candidatar agora":"Apply now", "Salvar vaga":"Save job", "Remover dos salvos":"Remove from saved", "Vagas recomendadas":"Recommended jobs", "Pessoas recomendadas":"Recommended people", "Empresas recomendadas":"Recommended companies", "Conexões recentes":"Recent connections", "Mensagens recentes":"Recent messages", "Configurações da conta":"Account settings", "Alterar senha":"Change password", "Sair da conta":"Sign out", "Abrir configurações":"Open settings", "Fechar configurações":"Close settings", "Tema do site":"Site theme", "Idioma do site":"Site language",
};

const englishToPortuguese = {
  "Settings":"Configurações", "Close":"Fechar", "Save":"Salvar", "Cancel":"Cancelar", "Send":"Enviar", "Delete":"Excluir", "Edit":"Editar", "Create":"Criar", "Search":"Buscar", "Loading":"Carregando", "Back":"Voltar", "Continue":"Continuar", "Next":"Próximo", "Previous":"Anterior", "Finish":"Concluir", "Sign in":"Entrar", "Sign out":"Sair", "Profile":"Perfil", "Home":"Início", "Jobs":"Vagas", "People":"Pessoas", "Companies":"Empresas", "Connections":"Conexões", "Notifications":"Notificações", "Messages":"Mensagens", "Posts":"Publicações", "Create post":"Criar publicação", "Create job":"Criar Vaga", "Create company":"Criar Empresa", "Discover":"Descobrir", "Theme":"Tema", "Language":"Idioma", "Light":"Claro", "Dark":"Escuro", "My network":"Minha rede", "View profile":"Ver perfil", "See more":"Ver mais", "Show more":"Mostrar mais", "Show less":"Mostrar menos", "See all":"Ver todos", "All":"Todos", "None":"Nenhum", "Yes":"Sim", "No":"Não", "Save changes":"Salvar alterações", "Update":"Atualizar", "Share":"Compartilhar", "Comment":"Comentar", "Like":"Curtir", "Liked":"Gostei", "Follow":"Seguir", "Following":"Seguindo", "Connect":"Conectar", "Connected":"Conectado", "Accept":"Aceitar", "Decline":"Recusar", "Reject":"Rejeitar", "Pending":"Pendente", "Send message":"Enviar mensagem", "Write a message":"Escreva uma mensagem", "Write a comment":"Escreva um comentário", "Add":"Adicionar", "Remove":"Remover", "Attach":"Anexar", "Photo":"Foto", "Image":"Imagem", "Video":"Vídeo", "About":"Sobre", "Experience":"Experiência", "Education":"Formação", "Skills":"Habilidades", "Location":"Localização", "Company":"Empresa", "Job title":"Cargo", "Description":"Descrição", "Title":"Título", "Name":"Nome", "Phone":"Telefone", "Password":"Senha", "Confirm password":"Confirmar senha", "Save profile":"Salvar perfil", "Edit profile":"Editar perfil", "About me":"Sobre mim", "Full name":"Nome completo", "Username":"Nome de usuário", "User":"Usuário", "Users":"Usuários", "Apply":"Candidatar-se", "Application":"Candidatura", "Applicants":"Candidatos", "Work type":"Tipo de trabalho", "Remote":"Remoto", "Hybrid":"Híbrido", "On-site":"Presencial", "Full time":"Tempo integral", "Part time":"Meio período", "Internship":"Estágio", "Salary":"Salário", "Benefits":"Benefícios", "Requirements":"Requisitos", "Responsibilities":"Responsabilidades", "Post job":"Publicar vaga", "Job":"Vaga", "Saved jobs":"Vagas salvas", "No jobs found":"Nenhuma vaga encontrada", "No results found":"Nenhum resultado encontrado", "No posts found":"Nenhuma publicação encontrada", "No messages":"Nenhuma mensagem", "Start a conversation":"Comece uma conversa", "Welcome":"Bem-vindo", "Hello":"Olá", "Thank you":"Obrigado", "Today":"Hoje", "Yesterday":"Ontem", "Now":"Agora", "Recent":"Recentes", "Recommended":"Recomendado", "Recommendations":"Recomendações", "Filters":"Filtros", "Filter":"Filtrar", "Sort by":"Ordenar por", "Date":"Data", "Category":"Categoria", "All categories":"Todas as categorias", "Select":"Selecionar", "Choose file":"Selecionar arquivo", "No file selected":"Nenhum arquivo selecionado", "Load more":"Carregar mais", "Try again":"Tentar novamente", "Something went wrong":"Algo deu errado", "An error occurred":"Ocorreu um erro", "Success":"Sucesso", "Error":"Erro", "Warning":"Atenção", "Administration":"Administração", "Admin dashboard":"Painel administrativo", "Moderation":"Moderação", "Report":"Denunciar", "Block":"Bloquear", "Unblock":"Desbloquear", "Account":"Conta", "Privacy":"Privacidade", "Help":"Ajuda", "Terms of service":"Termos de uso", "Privacy policy":"Política de privacidade", "Create account":"Criar conta", "Don't have an account?":"Não tem uma conta?", "Already have an account?":"Já tem uma conta?", "Sign in with Google":"Entrar com Google", "Sign in with Microsoft":"Entrar com Microsoft", "Step":"Etapa", "Details":"Detalhes", "Basic information":"Informações básicas", "Review":"Revisar", "Publish":"Publicar", "Draft":"Rascunho", "Active":"Ativo", "Inactive":"Inativo", "Open":"Aberto", "Closed":"Fechado", "No connections yet":"Nenhuma conexão ainda", "Discover people":"Descubra pessoas", "Story":"História", "Views":"Visualizações", "View posts":"Ver publicações", "All rights reserved":"Todos os direitos reservados", "Powered by":"Desenvolvido por", "Learn more":"Saiba mais", "How it works":"Como funciona", "Testimonials":"Depoimentos", "Get started":"Comece agora", "Find opportunities":"Encontre oportunidades", "For professionals":"Para profissionais", "For companies":"Para empresas", "Innovation":"Inovação", "Development":"Desenvolvimento", "Security":"Segurança", "Data and AI":"Dados e IA", "Cloud and DevOps":"Cloud e DevOps", "Type":"Tipo", "Job details":"Detalhe da vaga", "About the company":"Sobre a empresa", "Company name":"Nome da empresa", "Website":"Site", "Address":"Endereço", "Email address":"Endereço de e-mail", "Message":"Mensagem", "Recruiter":"Recrutador", "Professional":"Profissional", "Professionals":"Profissionais", "Feed":"Feed", "Post an update":"Publicar atualização", "What are you thinking?":"O que você está pensando?", "Write something":"Escreva algo", "Add photo":"Adicionar foto", "Add video":"Adicionar vídeo", "No results":"Sem resultados", "View details":"Ver detalhes", "Apply now":"Aplicar agora", "Save job":"Salvar vaga", "Recommended jobs":"Vagas recomendadas", "Recommended people":"Pessoas recomendadas", "Recommended companies":"Empresas recomendadas", "Recent connections":"Conexões recentes", "Recent messages":"Mensagens recentes", "Account settings":"Configurações da conta", "Change password":"Alterar senha", "Open settings":"Abrir configurações", "Close settings":"Fechar configurações", "Site theme":"Tema do site", "Site language":"Idioma do site"
};

// Additional page-specific interface copy. Keeping pairs in one place makes
// dictionary coverage auditable while preserving the legacy dictionaries.
const additionalTranslations = [
  ["Cor de fundo", "Background color"], ["Marcada como vista", "Marked as viewed"], ["Remota", "Remote"], ["Urgente", "Urgent"],
  ["Monitore, edite e remova conteúdos publicados.", "Monitor, edit, and remove published content."], ["Carregando...", "Loading..."],
  ["Sem posts.", "No posts."], ["Sem stories.", "No stories."], ["Sem mensagens.", "No messages."], ["mensagens - última", "messages - latest"],
  ["Sem vagas.", "No jobs."], ["Criada por", "Created by"], ["Digite uma mensagem...", "Type a message..."],
  ["Empresa não encontrada ou sem dados para exibir.", "Company not found or no data to display."], ["Trabalhe Conosco", "Work with us"],
  ["Sem posts desta empresa até o momento.", "No posts from this company yet."], ["Postado", "Posted"],
  ["Tecnologia utilizada pela empresa.", "Technology used by the company."], ["Sem membros para exibir.", "No members to display."],
  ["Framework utilizado nos projetos da empresa.", "Framework used in the company's projects."], ["Sem portfolio para exibir.", "No portfolio to display."],
  ["membros", "members"], ["Participar da empresa", "Join company"], ["Você é dono", "You own this company"], ["Você já participa", "You are already a member"],
  ["Editar empresa", "Edit Company"], ["Logo da empresa", "Company Logo"], ["Foto de capa", "Cover Photo"], ["Setor", "Industry"], ["Tecnologia", "Technology"], ["Tamanho", "Size"],
  ["Technologies", "Technologies"], ["Frameworks", "Frameworks"], ["Company description", "Company description"], ["Admin", "Admin"],
  ["Continuar com a Microsoft", "Continue with Microsoft"], ["Responder", "Reply"], ["Apagar post", "Delete post"], ["Apagar", "Delete"],
  ["Escreva um comentário...", "Write a comment..."], ["Carregando comentários...", "Loading comments..."], ["Seja o primeiro a comentar.", "Be the first to comment."],
  ["Editar perfil", "Edit Profile"], ["Foto de perfil", "Profile Picture"], ["Informe seu nome completo", "Please enter your full name"],
  ["Informe um nome de usuário", "Please enter a username"], ["Informe uma breve descrição", "Please enter a short bio"], ["Informe sua localização", "Please enter your location"],
  ["Bio", "Bio"], ["Portfolio", "Portfolio"], ["Separe os itens por vírgula.", "Separate items with commas."], ["Linguagens", "Languages"],
  ["Bibliotecas", "Libraries"], ["Currículo", "Resume"], ["Save Changes", "Save Changes"], ["Recent Messages", "Recent Messages"],
  ["Criar publicação", "Create Post"], ["Criar story", "Create Story"], ["Criar um story", "Create a Story"], ["O que está pensando?", "What's on your mind?"],
  ["Texto", "Text"], ["Foto/Vídeo", "Photo/Video"], ["Seguidores", "Followers"], ["Entrou em", "Joined"], ["Gerencie sua rede e descubra novas conexões", "Manage your network and discover new connections"],
  ["Ver perfil", "View Profile"], ["Deixar de seguir", "Unfollow"], ["Compartilhe suas ideias com o mundo", "Share your thoughts with the world"], ["O que está acontecendo?", "What's happening?"],
  ["Publicação adicionada", "Post Added"], ["Publicação não adicionada", "Post Not Added"], ["Publicar publicação", "Publish Post"], ["Adicione pelo menos uma imagem ou texto", "Please add at least one image or text"],
  ["Explore oportunidades, pessoas e empresas incríveis", "Explore jobs, people, and amazing companies"], ["Filtro ativo", "Active filter"], ["Limpar filtro", "Clear filter"],
  ["Encontrar vagas compatíveis", "Find matching jobs"], ["Para manter a resposta rápida, o ranking considera até", "To keep responses fast, ranking considers up to"],
  ["das vagas locais mais recentes.", "of the most recent local jobs."], ["Esta demonstração inclui", "This demo includes"], ["vagas da Remotive para enriquecer a busca.", "Remotive jobs to expand the search."],
  ["Nenhuma vaga encontrada para esse filtro.", "No jobs found for this filter."], ["Carregar mais recomendações", "Load more recommendations"],
  ["Nenhuma empresa encontrada", "No companies found"], ["Tente pesquisar novamente", "Try searching again"], ["Voltar ao topo", "Back to top"],
  ["Criar empresa", "Create company"], ["Use o formulário ao lado para registrar sua organização.", "Use the form beside this panel to register your organization."], ["Cadastro da empresa", "Company registration"],
  ["A organização é criada no Clerk e sincronizada no banco via Inngest.", "The organization is created in Clerk and synced to the database through Inngest."],
  ["Nome da empresa *", "Company name *"],   ["Localização", "Location"],
  ["Tecnologias (separadas por vírgula)", "Technologies (comma-separated)"], ["Frameworks (separados por vírgula)", "Frameworks (comma-separated)"], ["Descrição", "Description"], ["Descreva a sua empresa.", "Describe your company."],
  ["Connections", "Connections"],
  ["Evolua seu portfólio", "Improve your portfolio"], ["Encontre competências citadas em vagas relevantes, estude com materiais oficiais e registre projetos que tornam seu aprendizado visível.", "Find skills mentioned in relevant jobs, learn with official materials, and track projects that make your learning visible."],
  ["Seus objetivos profissionais", "Your career goals"], ["Use esses objetivos para personalizar sugestões quando não houver vagas comparáveis.", "Use these goals to personalize suggestions when there are no comparable jobs."],
  ["Área desejada (ex.: Frontend)", "Desired field (e.g., Frontend)"], ["Competências para desenvolver (separadas por vírgula)", "Skills to develop (comma-separated)"], ["Salvar objetivos", "Save goals"],
  ["Diagnóstico do portfólio", "Portfolio assessment"], ["Cursos e projetos práticos", "Courses and hands-on projects"], ["Não há lacunas identificadas no momento.", "No skill gaps identified right now."],
  ["Adicione competências ao portfólio ou volte quando houver vagas publicadas para receber recomendações.", "Add skills to your portfolio or check back when jobs are published to get recommendations."],
  ["Por que foi recomendado:", "Why it was recommended:"], ["Competência:", "Skill:"], ["Custo:", "Cost:"], ["Nível:", "Level:"], ["Consulte a plataforma", "Check the platform"], ["Pré-requisitos:", "Prerequisites:"],
  ["Funcionalidades:", "Features:"], ["Tecnologias:", "Technologies:"], ["Como fortalece o portfólio:", "How it strengthens your portfolio:"], ["Vagas relacionadas:", "Related jobs:"],
  ["Acompanhamento do curso", "Course progress"], ["Acompanhamento do projeto", "Project progress"], ["Quero fazer", "Want to take"], ["Em andamento", "In progress"], ["Concluído", "Completed"],
  ["Projeto planejado", "Project planned"], ["Projeto em andamento", "Project in progress"], ["Projeto concluído", "Project completed"],
  ["Competências adquiridas (confirme manualmente, separadas por vírgula)", "Skills acquired (confirm manually, comma-separated)"], ["Salvar competências", "Save skills"], ["Acessar curso", "Open learning resource"],
  ["Área desejada", "Desired field"], ["Base das recomendações:", "Recommendation basis:"], ["vagas compatíveis e lacunas encontradas", "matching jobs and identified gaps"],
  ["requisitos publicados (sem correspondência positiva)", "published requirements (no positive match)"], ["competências e objetivos do perfil; sem vagas comparáveis", "profile skills and goals; no comparable jobs"], ["catálogo geral de portfólio; informe sua área para personalizar", "general portfolio catalog; enter your field to personalize"],
  ["Get started", "Get started"], ["Começar agora", "Get started"], ["Começar", "Get started"], ["Abrir menu", "Open menu"], ["Ir para o início", "Go to home"], ["Entrar no ADAPT", "Sign in to ADAPT"],
  ["Conectando talentos e empresas", "Connecting talent and companies"], ["Encontre o match certo entre talento e oportunidade.", "Find the right match between talent and opportunity."],
  ["Criar meu perfil", "Create my profile"], ["Publicar uma vaga", "Post a job"], ["Matches de hoje", "Today's matches"], ["Conversa iniciada", "Conversation started"], ["Match recomendado", "Recommended match"],
  ["Fluxo integrado", "Integrated workflow"], ["Resultados", "Results"], ["Mais clareza para quem busca vaga e para quem contrata.", "More clarity for job seekers and employers."],
  ["Filtro de vagas", "Job filters"], ["Escolha uma área e refine pelas tecnologias ou trilhas mais importantes.", "Choose a field and refine by the most relevant technologies or learning paths."], ["Ver oportunidades", "View opportunities"],
  ["Alternar tema", "Toggle theme"], ["Informações básicas da vaga", "Basic job information"], ["Título da vaga *", "Job title *"], ["Empresa *", "Company *"], ["Localização *", "Location *"],
  ["Tipo de contrato *", "Contract type *"], ["Freelance", "Freelance"], ["Temporário", "Temporary"], ["Detalhes da vaga", "Job details"], ["Requisitos", "Requirements"], ["Benefícios", "Benefits"],
  ["Desenvolve {{skills}}, ainda não identificada em {{count}} vaga(s) comparável(is) que compartilham competências com seu perfil.", "Builds {{skills}}, a skill not yet identified in {{count}} comparable job(s) that share skills with your profile."],
  ["Desenvolve {{skills}}, citada em {{count}} vaga(s) publicada(s). Nenhuma teve correspondência positiva com seu perfil, então esta sugestão se baseia na demanda observada, não em compatibilidade.", "Builds {{skills}}, mentioned in {{count}} published job(s). None positively matched your profile, so this suggestion reflects observed demand, not compatibility."],
  ["Recomendado porque você informou interesse em desenvolver {{skills}}.", "Recommended because you said you want to develop {{skills}}."],
  ["Aproveita sua base declarada em {{skills}} para construir evidências práticas no portfólio.", "Builds on your declared {{skills}} to create practical portfolio evidence."],
  ["Sugestão geral de aprendizagem para construir um portfólio web demonstrável; não foi baseada em vagas compatíveis nem em uma meta profissional informada.", "General learning suggestion to build a demonstrable web portfolio; it is not based on matching jobs or a stated career goal."],
  ["Recomendações fundamentadas em {{count}} vagas publicadas que compartilham competências com o perfil.", "Recommendations based on {{count}} published job(s) that share skills with the profile."],
  ["Nenhuma vaga teve correspondência positiva com as competências declaradas. As sugestões usam requisitos de vagas publicadas, não são apresentadas como vagas compatíveis.", "No jobs positively matched the declared skills. Suggestions use published job requirements and are not presented as matching jobs."],
  ["Não foram encontradas vagas comparáveis. As sugestões usam as competências do perfil, seus objetivos e materiais gerais de portfólio.", "No comparable jobs were found. Suggestions use profile skills, career goals, and general portfolio resources."],
  ["O perfil atual não armazena projetos estruturados; as recomendações usam competências declaradas e requisitos das vagas.", "The current profile does not store structured projects; recommendations use declared skills and job requirements."],
  ["Competências ausentes são tratadas como não identificadas no perfil, não como desconhecidas pelo candidato.", "Missing skills are treated as not identified in the profile, not as skills the candidate does not know."],
  ["Progresso salvo. As recomendações foram atualizadas.", "Progress saved. Recommendations were updated."], ["Não foi possível carregar seu plano de aprendizagem.", "Could not load your learning plan."],
  ["Não foi possível salvar o progresso.", "Could not save progress."], ["Objetivos atualizados; recomendações recalculadas.", "Goals updated; recommendations recalculated."], ["Não foi possível salvar seus objetivos.", "Could not save your goals."],
  ["Iniciante", "Beginner"], ["Intermediário", "Intermediate"], ["Vários níveis", "Multiple levels"], ["Gratuito", "Free"], ["Há cursos gratuitos", "Some courses are free"],
  ["Gerenciador de tarefas tipado", "Typed task manager"], ["Portfólio web responsivo", "Responsive web portfolio"], ["Portfólio versionado no GitHub", "GitHub-versioned portfolio"], ["Painel de oportunidades", "Job opportunities dashboard"],
  ["Suíte de testes de interface", "UI test suite"], ["Aplicação conteinerizada", "Containerized application"], ["Aplicação preparada para nuvem", "Cloud-ready application"], ["API serverless", "Serverless API"], ["API de catálogo com MongoDB", "MongoDB catalog API"], ["Analisador de dados abertos", "Open data analyzer"],
  ["Componentes reutilizáveis", "Reusable components"], ["Testes e README", "Tests and README"], ["Layout responsivo", "Responsive layout"], ["Publicação e README", "Deployment and README"], ["Commits pequenos e descritivos", "Small, descriptive commits"],
  ["Branches e pull requests", "Branches and pull requests"], ["README com instalação e demonstração", "README with setup and demo"], ["Histórico público do projeto", "Public project history"],
  ["Busca e filtros", "Search and filters"], ["Estados de carregamento e erro", "Loading and error states"], ["Testes de componentes", "Component tests"], ["README com decisões técnicas", "README with technical decisions"],
  ["Testes acessíveis por rótulo", "Accessible tests using labels"], ["Casos de sucesso e erro", "Success and error cases"], ["Teste de interação", "Interaction test"], ["Comando de execução no README", "Run command in the README"],
  ["Verifique os pré-requisitos na plataforma", "Check the prerequisites on the platform"],
  ["{{count}} vaga(s) comparável(is) analisada(s).", "{{count}} comparable job(s) analyzed."],
  ["O projeto demonstra {{skills}} por meio de código, testes e documentação pública.", "The project demonstrates {{skills}} through code, tests, and public documentation."],
  ["Regras explícitas sobre requisitos publicados, competências declaradas e objetivos informados; sem pontuação probabilística ou chamadas a IA generativa.", "Explicit rules based on published requirements, declared skills, and stated goals; no probability scores or generative AI calls."],
  ["Nenhuma competência cadastrada no portfólio ainda.", "No skills have been added to the portfolio yet."],
  ["Cadastrar", "Sign up"],   
  ["Adicionar ao menos uma imagem ou texto", "Add at least one image or text"],  
    
  ["Digite um nome ou nome de usuário", "Search by name or username"], ["Converse com seus amigos e empresas", "Talk to your friends and companies"],
  ["Portfólio técnico", "Technical portfolio"], ["Competências, ferramentas e currículo do perfil.", "Profile skills, tools, and resume."], ["Nada informado.", "Nothing provided."],
  ["Nenhuma informação de portfólio cadastrada ainda.", "No portfolio information has been added yet."], ["Adicionar nome de usuário", "Add a username"], ["Adicionar localização", "Add location"],
   ["Publicações", "Posts"],  ["Seguindo", "Following"], ["Visitar Site", "Visit website"], ["Sem site", "No website"],
  ["Setor não informado", "Industry not provided"], ["Setor nao informado", "Industry not provided"],  ["Voce e dono", "You own this company"],
   ["Voce ja participa", "You are already a member"], ["Sem posts desta empresa ate o momento.", "No posts from this company yet."],
  ["Empresa nao encontrada ou sem dados para exibir.", "Company not found or no data to display."], 
  ["Vagas da empresa", "Company jobs"], ["Gerencie vagas de emprego para profissionais de tecnologia", "Manage job openings for technology professionals"],
  ["Criar Nova Vaga", "Create a new job"], ["Carregando vagas...", "Loading jobs..."], ["Nenhuma vaga publicada", "No published jobs"],
  ["Comece criando sua primeira vaga de emprego", "Start by creating your first job opening"], ["Criar Primeira Vaga", "Create your first job"], ["Excluir vaga?", "Delete job?"],
  ["Revisão e publicação", "Review and publish"], ["Revise todas as informações antes de publicar a vaga", "Review all information before publishing the job"],
  ["Atenção:", "Warning:"], ["Salvar rascunho", "Save draft"], ["Criar nova vaga", "Create a new job"], ["Encontre os melhores talentos para sua empresa", "Find the best talent for your company"],
  ["Não foi possível carregar sua conta", "Could not load your account"], ["Tente recarregar a página para buscar seus dados novamente.", "Reload the page to fetch your data again."],
   ["Desenvolvimento", "Development"], ["Segurança", "Security"], ["Dados e IA", "Data and AI"],
   ["A rede profissional para conectar talentos de tecnologia, empresas e oportunidades com mais contexto.", "A professional network connecting tech talent, companies, and opportunities with more context."],
  ["Transforme sua rede profissional em novas oportunidades.", "Turn your professional network into new opportunities."], ["Entre no ADAPT para criar seu perfil, encontrar vagas de tecnologia e conversar com empresas que procuram talentos como você.", "Join ADAPT to create your profile, find tech jobs, and connect with companies looking for talent like you."],
  ["Acessar o ADAPT", "Open ADAPT"], ["Feito para aproximar pessoas, times e tecnologia.", "Built to bring people, teams, and technology closer."],
  ["Rede de talentos e vagas para tecnologia", "A network for tech talent and jobs"], ["O ADAPT aproxima profissionais de TI, empresas e recrutadores em um ambiente com perfil, vagas, conexões e conversas no mesmo fluxo.", "ADAPT brings IT professionals, companies, and recruiters together with profiles, jobs, connections, and conversations in one place."],
  ["Candidatos ganham clareza sobre onde se encaixam. Empresas reduzem ruído e chegam mais rápido em pessoas com contexto.", "Candidates get clarity on where they fit. Companies reduce noise and reach people with relevant context faster."],
  ["Perfil, descoberta, conexão, mensagem e vaga conversam entre si dentro do ADAPT.", "Profiles, discovery, connections, messages, and jobs work together in ADAPT."],
  ["Conectamos talentos com oportunidades", "We connect talent with opportunity"], ["Benefícios para todos", "Benefits for everyone"], ["Comece hoje mesmo", "Get started today"],
  ["Pronto para dar o próximo passo na sua carreira?", "Ready to take the next step in your career?"], ["Criar conta grátis", "Create a free account"],
  ["Encontre especialistas em diversas áreas da tecnologia, prontos para impulsionar seu projeto.", "Find experts across technology fields, ready to move your project forward."],
  ["Vagas compatíveis", "Matching jobs"],

  ["Modalidade de trabalho", "Work arrangement"], ["Presencial", "On-site"], ["Híbrido", "Hybrid"],
  ["Requisitos desejáveis", "Preferred qualifications"], ["Requisitos obrigatórios", "Required qualifications"],
  ["Diferencie conhecimentos que contam como bônus dos requisitos obrigatórios.", "Separate bonus skills from mandatory qualifications."],
  ["Adicionar desejável", "Add preferred qualification"], ["Desejável", "Preferred"], ["(opcional)", "(optional)"],
  ["Salário (opcional)", "Salary (optional)"], ["Mínimo", "Minimum"], ["Máximo", "Maximum"],
  ["Aprendiz", "Apprentice"], ["Trainee", "Trainee"], ["Estágio", "Internship"],
  ["Cadastre uma empresa antes de criar vagas.", "Register a company before creating job postings."],
  ["Empresa vinculada à sua conta.", "Company linked to your account."], ["Carregando empresa…", "Loading company…"],
  ["Não foi possível carregar os dados da empresa.", "Could not load company details."],
  ["Editar", "Edit"], ["Continuar edição da vaga", "Continue editing job"],
  ["Não foi possível salvar a vaga.", "Could not save the job."], ["Não foi possível publicar a vaga.", "Could not publish the job."],
  ["Não foi possível salvar o rascunho.", "Could not save the draft."], ["Não foi possível carregar suas vagas.", "Could not load your jobs."],
  ["Não foi possível excluir a vaga.", "Could not delete the job."], ["Não foi possível atualizar a vaga.", "Could not update the job."],
  ["Vaga não encontrada ou sem permissão.", "Job not found or access denied."],
  ["Use até 40 itens de texto.", "Use at most 40 text items."], ["Use itens de no máximo 500 caracteres.", "Each item can contain up to 500 characters."],
  ["Informe ao menos um requisito obrigatório.", "Add at least one required qualification."],
  ["Identificador de vaga inválido.", "Invalid job identifier."], ["Você não tem autorização para gerenciar esta empresa.", "You are not authorized to manage this company."],
  ["Ex: São Paulo - SP", "e.g. São Paulo, Brazil"], ["Júnior (0-2 anos)", "Junior (0-2 years)"],
  ["Pleno (2-5 anos)", "Mid-level (2-5 years)"], ["Sênior (5+ anos)", "Senior (5+ years)"],
  ["até", "to"], ["Salário máximo", "Maximum salary"],
  ["Competências não identificadas no perfil:", "Skills not identified in the profile:"],
  ["Competências identificadas:", "Skills identified:"], ["Competências declaradas no portfólio:", "Skills declared in the portfolio:"],
  ["Obrigatórias atendidas:", "Required skills matched:"], ["Obrigatórias não identificadas:", "Required skills not identified:"],
  ["Desejáveis identificadas:", "Preferred skills matched:"], ["Desejáveis não identificadas:", "Preferred skills not identified:"],
  ["Competências citadas na vaga (sem classificação de obrigatoriedade):", "Skills mentioned in the job (not classified as required or preferred):"],
  ["Citadas e identificadas no perfil:", "Mentioned and identified in the profile:"], ["Citadas e não identificadas no perfil:", "Mentioned but not identified in the profile:"],
  ["Não avaliados:", "Not assessed:"], ["Conteúdos para desenvolver competências", "Learning resources to develop skills"],
  ["Relaciona-se a:", "Related to:"], ["Não há um conteúdo verificado cadastrado para estas competências ainda.", "No verified learning resource is available for these skills yet."],
  ["Fonte:", "Source:"], ["Ver vaga", "View job"], ["Não foi possível carregar a imagem", "Error loading image"],
  ["Esta ação não pode ser desfeita. A vaga \"", "This action cannot be undone. The job \""],
  ["\" será permanentemente removida.", "\" will be permanently deleted."],
  ["Ao publicar, esta vaga ficará visível para todos os candidatos da plataforma. Certifique-se de que todas as informações estão corretas.", "When published, this job will be visible to all candidates on the platform. Please verify all details are correct."],
  ["Navegação estrutural", "breadcrumb"], ["Mais", "More"], ["Slide anterior", "Previous slide"], ["Próximo slide", "Next slide"],
  ["Paginação", "Pagination"], ["Ir para a página anterior", "Go to previous page"], ["Ir para a próxima página", "Go to next page"], ["Mais páginas", "More pages"],
  ["Barra lateral", "Sidebar"], ["Exibe a barra lateral em dispositivos móveis.", "Displays the mobile sidebar."], ["Alternar barra lateral", "Toggle sidebar"],
  ["Somente um administrador da organização pode sincronizar a empresa.", "Only an organization administrator can sync the company."],
  ["Esta organização já está vinculada a outra conta.", "This organization is already linked to another account."],
  ["Não foi possível sincronizar a empresa.", "Could not sync the company."],
  ["Revise os campos abaixo:", "Review the fields below:"], ["Revise os campos destacados.", "Review the highlighted fields."],
  ["Este campo é obrigatório.", "This field is required."], ["Informe uma lista válida.", "Enter a valid list."],
  ["Informe um texto válido.", "Enter valid text."], ["Informe um valor numérico válido ou deixe em branco.", "Enter a valid number or leave this blank."],
  ["O salário máximo deve ser igual ou maior que o mínimo.", "Maximum salary must be at least the minimum salary."],
  ["Selecione uma moeda válida.", "Select a valid currency."], ["Selecione uma modalidade válida.", "Select a valid work arrangement."],
  ["A vaga ", "The job "], [" será permanentemente removida.", " will be permanently deleted."],
  ["Editar vaga", "Edit job"], ["Nenhuma vaga cadastrada", "No jobs have been added yet."],
   
   
  ["Ex: Técnico de Redes Pleno", "e.g. Mid-level Network Technician"], ["Nome da sua empresa", "Your company name"],
   ["Modalidade de trabalho *", "Work arrangement *"],
  ["Nível de experiência *", "Experience level *"], ["Vaga urgente", "Urgent opening"],
   ["Descrição da vaga *", "Job description *"],
  ["Descreva as principais responsabilidades e o que o candidato irá fazer no dia a dia...", "Describe the main responsibilities and the candidate's day-to-day work..."],
  ["Requisitos *", "Required qualifications *"], ["Adicionar requisito", "Add qualification"],
  ["Benefícios (opcionais)", "Benefits (optional)"], ["Adicionar benefício", "Add benefit"],
  
  ["Esta ação não pode ser desfeita. A vaga ", "This action cannot be undone. The job "],
  
   
  
  ["Publicado em", "Posted on"], 
  ["Rascunho salvo.", "Draft saved."], ["Vaga criada com sucesso.", "Job created successfully."],
  ["Rascunho atualizado.", "Draft updated."], ["Vaga publicada.", "Job published."],
  ["Excluída com sucesso.", "Deleted successfully."]
];

for (const [portuguese, english] of additionalTranslations) {
  if (!Object.prototype.hasOwnProperty.call(portugueseToEnglish, portuguese)) portugueseToEnglish[portuguese] = english;
  if (!Object.prototype.hasOwnProperty.call(englishToPortuguese, english)) englishToPortuguese[english] = portuguese;
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function repairMojibake(value) {
  if (!/[ÃÂâ€]/.test(value)) return value;
  const codePoints = Array.from(value, (character) => character.codePointAt(0));
  if (codePoints.some((point) => point > 255)) return value;
  const repaired = new TextDecoder("utf-8").decode(Uint8Array.from(codePoints));
  return repaired.includes("\uFFFD") ? value : repaired;
}

for (const dictionary of [portugueseToEnglish, englishToPortuguese]) {
  for (const [key, value] of Object.entries(dictionary)) {
    const repairedKey = repairMojibake(key);
    const repairedValue = repairMojibake(value);
    if (repairedKey !== key) delete dictionary[key];
    dictionary[repairedKey] = repairedValue;
  }
}
const keysByLanguage = {
  en: Object.keys(portugueseToEnglish).sort((a, b) => b.length - a.length),
  pt: Object.keys(englishToPortuguese).sort((a, b) => b.length - a.length),
};

// Keep source text per DOM node so changing locale never has to translate an
// already translated string back. This also prevents observer feedback loops.
const originalTextNodes = new WeakMap();
const translatedTextNodes = new WeakMap();
const originalAttributes = new WeakMap();
const translatedAttributes = new WeakMap();
const missingTranslationWarnings = new Set();

function translateText(value, language) {
  value = repairMojibake(value);
  const dictionary = language === "en" ? portugueseToEnglish : englishToPortuguese;
  const keys = keysByLanguage[language];
  if (dictionary[value.trim()]) return value.replace(value.trim(), dictionary[value.trim()]);
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])(${keys.map(escapeRegExp).join("|")})(?=$|[^\\p{L}\\p{N}])`, "giu");
  return value.replace(pattern, (match, prefix, word) => `${prefix}${dictionary[word] ?? dictionary[keys.find((key) => key.toLowerCase() === word.toLowerCase())] ?? word}`);
}

const ignoredForTranslation = (element) => Boolean(element?.closest?.(
  '[data-i18n-ignore], script, style, noscript, textarea, [contenteditable="true"]'
));

function translateTextNode(node, language) {
  if (ignoredForTranslation(node.parentElement)) return;
  const current = node.nodeValue || "";
  const previousTranslation = translatedTextNodes.get(node);
  const original = previousTranslation !== undefined && current === previousTranslation
    ? originalTextNodes.get(node)
    : current;
  originalTextNodes.set(node, original);
  const updated = translateText(original, language);
  translatedTextNodes.set(node, updated);
  if (updated !== current) node.nodeValue = updated;
}

function translateAttribute(element, attribute, language) {
  if (ignoredForTranslation(element)) return;
  const current = element.getAttribute(attribute);
  if (!current) return;
  let originals = originalAttributes.get(element);
  if (!originals) {
    originals = new Map();
    originalAttributes.set(element, originals);
  }
  let translations = translatedAttributes.get(element);
  if (!translations) {
    translations = new Map();
    translatedAttributes.set(element, translations);
  }
  const original = translations.has(attribute) && current === translations.get(attribute)
    ? originals.get(attribute)
    : current;
  originals.set(attribute, original);
  const updated = translateText(original, language);
  translations.set(attribute, updated);
  if (updated !== current) element.setAttribute(attribute, updated);
}

function translateNode(node, language) {
  if (node.nodeType === Node.TEXT_NODE) {
    translateTextNode(node, language);
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE || ignoredForTranslation(node)) return;
  for (const attribute of ["placeholder", "title", "aria-label", "alt"]) translateAttribute(node, attribute, language);
  for (const child of node.childNodes) translateNode(child, language);
}

function translateDocument(language) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = language === "en" ? "en" : "pt-BR";
  translateNode(document.body, language);
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "pt");
  const setLanguage = (nextLanguage) => {
    if (nextLanguage !== "en" && nextLanguage !== "pt") return;
    localStorage.setItem(STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    translateDocument(language);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target, language);
        } else if (mutation.type === "attributes") {
          translateAttribute(mutation.target, mutation.attributeName, language);
        } else {
          for (const node of mutation.addedNodes) translateNode(node, language);
        }
      }
    });
    if (document.body) observer.observe(document.body, {
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"],
      subtree: true,
    });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({
    language,
    locale: language === "en" ? "en" : "pt-BR",
    setLanguage,
    t: (source) => {
      if (typeof source !== "string") return source;
      const result = translateText(source, language);
      if (language === "en" && result === source && source.trim() && import.meta.env?.DEV && !missingTranslationWarnings.has(source)) {
        missingTranslationWarnings.add(source);
        console.warn(`[i18n] Missing English translation for interface text: ${source}`);
      }
      return result;
    },
    formatDate: (value, options) => new Intl.DateTimeFormat(language === "en" ? "en" : "pt-BR", options).format(value instanceof Date ? value : new Date(value)),
    formatNumber: (value, options) => new Intl.NumberFormat(language === "en" ? "en" : "pt-BR", options).format(value),
    formatCurrency: (value, currency = "USD", options) => new Intl.NumberFormat(language === "en" ? "en" : "pt-BR", { style: "currency", currency, ...options }).format(value),
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

