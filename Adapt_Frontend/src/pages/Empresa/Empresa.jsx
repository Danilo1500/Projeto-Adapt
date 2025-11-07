import React, { useState } from "react";
import { useUser, useOrganizationList } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  Globe,
  FileText,
  Upload,
  Plus,
  X,
  FileCheck,
} from "lucide-react";

/**
 * Página para criar organização (empresa)
 * - Visual inspirado no seu ProfileModal
 * - Campos: nome (obrigatório), setor, website, localização, descrição, tamanho,
 *   tecnologias (tags), logo (upload), capa (upload), certificados (lista com upload)
 * - Integração: createOrganization + setActive do Clerk
 * - OBS: Salvar metadados/arquivos (logo, cover, certificados) no backend é recomendado —
 *   aqui deixei o ponto para enviar ao seu backend.
 */

const companySizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

const techSuggestions = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Python",
  "Java",
  "AWS",
  "Docker",
];

export default function CreateOrganizationPage() {
  const { user } = useUser();
  const { createOrganization, setActive } = useOrganizationList();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    industry: "",
    website: "",
    location: "",
    description: "",
    size: companySizes[0],
    technologies: [],
  });

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [techInput, setTechInput] = useState("");
  const [certDraft, setCertDraft] = useState({ title: "", issuer: "", date: "", file: null });
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helpers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTechnology = () => {
    const t = techInput.trim();
    if (!t) return;
    if (!form.technologies.includes(t)) {
      setForm({ ...form, technologies: [...form.technologies, t] });
    }
    setTechInput("");
  };

  const removeTechnology = (t) =>
    setForm({ ...form, technologies: form.technologies.filter((x) => x !== t) });

  const handleLogoChange = (e) => setLogoFile(e.target.files?.[0] ?? null);
  const handleCoverChange = (e) => setCoverFile(e.target.files?.[0] ?? null);

  const handleCertFileChange = (e) => setCertDraft({ ...certDraft, file: e.target.files?.[0] ?? null });
  const handleCertChange = (field, value) => setCertDraft({ ...certDraft, [field]: value });

  const addCertificate = () => {
    if (!certDraft.title.trim()) return alert("Informe o nome do certificado.");
    setCertificates([...certificates, certDraft]);
    setCertDraft({ title: "", issuer: "", date: "", file: null });
  };

  const removeCertificate = (idx) => setCertificates(certificates.filter((_, i) => i !== idx));

  // Slug helper
  const makeSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);

  // Create org on Clerk (only name & slug guaranteed)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Você precisa fazer login para criar uma empresa.");
      return;
    }
    if (!form.name.trim()) {
      alert("Nome da empresa é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      const orgPayload = {
        name: form.name.trim(),
        slug: makeSlug(form.name),
      };

      // createOrganization retorna a organização criada
      const org = await createOrganization(orgPayload);

      // define organização ativa para o usuário (melhora fluxo)
      await setActive({ organization: org });

      // --- Aqui: enviar os metadados e arquivos ao seu backend ---
      // Exemplo (placeholder):
      // const metadata = { industry: form.industry, website: form.website, location: form.location, description: form.description, size: form.size, technologies: form.technologies, certificates: certificates.map(c=>({title: c.title, issuer: c.issuer, date: c.date})) }
      // const fd = new FormData();
      // fd.append('orgId', org.id);
      // fd.append('metadata', JSON.stringify(metadata));
      // if (logoFile) fd.append('logo', logoFile);
      // if (coverFile) fd.append('cover', coverFile);
      // certificates.forEach((c, i) => { if (c.file) fd.append(`certificate_${i}`, c.file); });
      // await fetch('/api/organizations', { method: 'POST', body: fd });

      // Feedback
      alert(`Empresa "${org.name}" criada com sucesso!`);
      navigate("/");
    } catch (err) {
      console.error("Erro ao criar organização:", err);
      alert("Erro ao criar a empresa. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-200 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-lg text-center">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2">Você precisa entrar</h2>
          <p className="text-indigo-700 mb-4">Faça login para criar uma nova empresa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-3xl w-full"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">Criar Nova Empresa</h1>
            <p className="text-indigo-700 mt-1">Cadastre os dados para começar a usar o ADAPT.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: name + industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none"
                placeholder="Ex: TechCorp Solutions"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Setor</label>
              <input
                name="industry"
                value={form.industry}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none"
                placeholder="Ex: Tecnologia, Educação, Saúde"
              />
            </div>
          </div>

          {/* Row 2: website + location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <div className="flex items-center gap-2">
                <Globe className="text-indigo-600" />
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none"
                  placeholder="https://"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none"
                placeholder="Cidade, País"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none resize-none"
              placeholder="Breve descrição sobre a empresa (missão, atuação, etc.)"
            />
          </div>

          {/* size + tech */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho da Empresa</label>
              <select
                name="size"
                value={form.size}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none"
              >
                {companySizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tecnologias (adicione)</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                  placeholder="Ex: React, Node.js"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-3 bg-indigo-700 text-white rounded-xl hover:bg-indigo-800 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.technologies.length > 0 ? (
                  form.technologies.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 border-2 border-indigo-100 rounded-xl text-indigo-700"
                    >
                      <span className="text-sm truncate max-w-[120px]">{t}</span>
                      <button
                        type="button"
                        onClick={() => removeTechnology(t)}
                        className="p-1 hover:bg-indigo-100 rounded-full"
                        aria-label={`Remover ${t}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <div className="text-gray-400 italic text-sm">Nenhuma tecnologia adicionada</div>
                )}
              </div>
            </div>
          </div>

          {/* Uploads: logo + cover */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo (opcional)</label>
              <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-white">
                <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
                <Upload className="w-5 h-5 text-indigo-600" />
                <div className="flex-1 text-sm text-gray-700">
                  {logoFile ? logoFile.name : "Clique para fazer upload do logo"}
                </div>
                {logoFile && <FileCheck className="w-5 h-5 text-green-600" />}
              </label>
              {logoFile && (
                <div className="mt-3">
                  <img src={URL.createObjectURL(logoFile)} alt="preview logo" className="w-28 h-28 object-cover rounded-xl border" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Capa (opcional)</label>
              <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-white">
                <input type="file" accept="image/*" hidden onChange={handleCoverChange} />
                <Upload className="w-5 h-5 text-indigo-600" />
                <div className="flex-1 text-sm text-gray-700">
                  {coverFile ? coverFile.name : "Clique para fazer upload da capa"}
                </div>
                {coverFile && <FileCheck className="w-5 h-5 text-green-600" />}
              </label>
              {coverFile && (
                <div className="mt-3">
                  <img src={URL.createObjectURL(coverFile)} alt="preview cover" className="w-full h-28 object-cover rounded-xl border" />
                </div>
              )}
            </div>
          </div>

          {/* Certificates */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Certificados / Reconhecimentos</h3>
              <div className="text-sm text-gray-400">Adicione documentos (opcional)</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-amber-50 border-2 border-amber-100 rounded-2xl p-4">
              <input
                value={certDraft.title}
                onChange={(e) => handleCertChange("title", e.target.value)}
                placeholder="Nome do certificado"
                className="px-4 py-3 rounded-xl border-2 border-amber-200 outline-none"
              />
              <input
                value={certDraft.issuer}
                onChange={(e) => handleCertChange("issuer", e.target.value)}
                placeholder="Emissor (ex: AWS, Google)"
                className="px-4 py-3 rounded-xl border-2 border-amber-200 outline-none"
              />
              <input
                type="date"
                value={certDraft.date}
                onChange={(e) => handleCertChange("date", e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-amber-200 outline-none"
              />
              <label className="flex items-center gap-3 px-4 py-3 border-2 border-amber-200 rounded-xl cursor-pointer bg-white">
                <input type="file" accept=".pdf,image/*" hidden onChange={handleCertFileChange} />
                <Upload className="w-5 h-5 text-amber-600" />
                <div className="flex-1 text-sm text-gray-700 truncate">
                  {certDraft.file ? certDraft.file.name : "Upload do arquivo"}
                </div>
                {certDraft.file && <FileCheck className="w-5 h-5 text-green-600" />}
              </label>

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="button"
                  onClick={addCertificate}
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => setCertDraft({ title: "", issuer: "", date: "", file: null })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl"
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Listagem de certificados adicionados */}
            <div className="mt-4 space-y-3">
              {certificates.length === 0 ? (
                <div className="text-gray-400 italic text-sm">Nenhum certificado adicionado</div>
              ) : (
                certificates.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl bg-white">
                    <div className="min-w-0">
                      <div className="text-gray-900 font-medium truncate">{c.title}</div>
                      <div className="text-gray-500 text-sm">
                        {c.issuer} {c.date && `• ${c.date}`}
                      </div>
                      {c.file && <div className="text-xs text-gray-400 mt-1 truncate flex items-center gap-1"><FileCheck className="w-3 h-3" /> {c.file.name}</div>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button type="button" onClick={() => removeCertificate(i)} className="px-3 py-2 rounded-lg border-2 border-red-100 text-red-600">Remover</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t-2 border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3.5 rounded-xl text-white transition ${
                loading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700"
              }`}
            >
              {loading ? "Criando empresa..." : "Criar Empresa"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
