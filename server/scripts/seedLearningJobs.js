import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";

const args = Object.fromEntries(process.argv.slice(2).flatMap((argument) => {
  const [key, value] = argument.split("=");
  return key?.startsWith("--") ? [[key.slice(2), value]] : [];
}));

const userId = args.user;
const companyId = args.company;

if (!userId || !companyId) {
  console.error("Uso: npm run seed:learning-jobs -- --user=<clerk-user-id> --company=<company-id>");
  process.exit(1);
}

const jobTemplates = [
  ["Desenvolvedor Frontend React", "São Paulo - SP", ["React", "TypeScript", "HTML", "CSS", "Vitest", "Figma"]],
  ["Desenvolvedor Backend Node.js", "Remoto", ["Node.js", "Express", "MongoDB", "REST", "Docker", "Git"]],
  ["Desenvolvedor Full Stack JavaScript", "Belo Horizonte - MG", ["JavaScript", "React", "Node.js", "MongoDB", "Git", "Docker"]],
  ["Analista de Dados Python", "Remoto", ["Python", "SQL", "Pandas", "Power BI", "Git", "Estatística"]],
  ["Engenheiro de QA", "Curitiba - PR", ["Testing", "JavaScript", "Cypress", "GitHub Actions", "API", "Postman"]],
  ["Desenvolvedor Mobile React Native", "São Paulo - SP", ["React Native", "JavaScript", "TypeScript", "REST", "Git", "Figma"]],
  ["Especialista AWS Cloud", "Remoto", ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"]],
  ["Desenvolvedor Java Spring", "Rio de Janeiro - RJ", ["Java", "Spring Boot", "SQL", "REST", "Docker", "Git"]],
  ["Desenvolvedor Python Django", "Remoto", ["Python", "Django", "PostgreSQL", "REST", "Docker", "Git"]],
  ["Analista DevOps", "Campinas - SP", ["Linux", "Docker", "Kubernetes", "GitHub Actions", "AWS", "Terraform"]],
  ["Desenvolvedor React TypeScript", "Porto Alegre - RS", ["React", "TypeScript", "Testing Library", "Git", "REST", "Figma"]],
  ["Administrador de Banco PostgreSQL", "São Paulo - SP", ["PostgreSQL", "SQL", "Modelagem de dados", "Índices", "Docker", "Backup"]],
];

await connectDB();

try {
  const company = await Company.findById(companyId).lean();
  if (!company) throw new Error("Empresa não encontrada.");
  const canManage = company.ownerId === userId || (company.members || []).some((member) =>
    member === userId || member?.user === userId || member?.userId === userId
  );
  if (!canManage) throw new Error("O usuário não pertence aos membros da empresa.");

  let inserted = 0;

  for (const [index, [title, location, requirements]] of jobTemplates.entries()) {
    const exists = await Job.exists({ companyId: company._id, title, status: "published" });
    if (exists) continue;

    await Job.create({
      user: userId,
      companyId: company._id,
      company: company.name,
      title,
      location,
      contractType: "CLT",
      experienceLevel: index % 3 === 0 ? "Júnior (0-2 anos)" : index % 3 === 1 ? "Pleno (2-5 anos)" : "Sênior (5+ anos)",
      salaryMin: String(3500 + (index % 4) * 1500),
      salaryMax: String(6500 + (index % 4) * 2500),
      currency: "R$",
      isRemote: location === "Remoto",
      workMode: location === "Remoto" ? "remote" : "hybrid",
      isUrgent: index % 4 === 0,
      description: "Atue no desenvolvimento e na evolução de soluções digitais, colaborando com produto, design e engenharia para entregar funcionalidades acessíveis, testáveis e bem documentadas.",
      requirements,
      desiredRequirements: [...requirements.slice(0, 2), "Comunicação", "Trabalho em equipe"],
      benefits: ["Vale refeição", "Plano de saúde", "Home office flexível"],
      status: "published",
    });
    inserted += 1;
  }

  console.log(JSON.stringify({
    company: company.name,
    inserted,
    totalPublished: await Job.countDocuments({ status: "published" }),
  }, null, 2));
} finally {
  await mongoose.disconnect();
}
