import { useState } from "react";
import { useAuth, useOrganizationList } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { useTheme } from "../../../context/ThemeContext";

const initialForm = {
  name: "",
  industry: "",
  size: "",
  location: "",
  website: "",
  description: "",
  technologies: "",
  frameworks: "",
};

const normalizeTags = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const CreateCompanyCard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const { isLoaded, createOrganization, setActive } = useOrganizationList();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const makeSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Informe o nome da empresa.");
      return;
    }
    if (!isLoaded) {
      toast.error("Aguarde o Clerk carregar para criar a empresa.");
      return;
    }

    setLoading(true);
    try {
      const organization = await createOrganization({
        name: form.name.trim(),
        slug: makeSlug(form.name),
      });

      await setActive({ organization });

      const token = await getToken();
      const payload = {
        clerkOrganizationId: organization.id,
        name: form.name.trim(),
        slug: makeSlug(form.name),
        industry: form.industry.trim(),
        size: form.size.trim(),
        location: form.location.trim(),
        website: form.website.trim(),
        description: form.description.trim(),
        technologies: normalizeTags(form.technologies),
        frameworks: normalizeTags(form.frameworks),
        certifications: [],
      };

      const { data } = await api.post("/api/company/sync", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success) {
        toast.error(data.message || "Erro ao sincronizar empresa.");
        return;
      }

      toast.success("Empresa criada e salva com sucesso.");
      navigate("/company");
    } catch (error) {
      toast.error(error?.errors?.[0]?.message || error.message || "Erro ao criar empresa.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-indigo-500 ${
    isDark ? "border-slate-600 bg-slate-900 text-slate-100" : "border-slate-300 bg-white text-slate-900"
  }`;

  const labelClass = `mb-1 block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`;

  return (
    <section
      className={`w-full rounded-2xl border p-6 md:p-8 shadow-sm ${
        isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
      }`}
    >
      <h2 className={`text-2xl font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
        Cadastro da empresa
      </h2>
      <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
        A organizaÃ§Ã£o Ã© criada no Clerk e sincronizada no banco via Inngest.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className={labelClass}>Nome da empresa *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex.: Adapt Tech"
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Setor</label>
            <input
              name="industry"
              value={form.industry}
              onChange={handleChange}
              placeholder="Tecnologia"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tamanho</label>
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="11-50 colaboradores"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Localizacao</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Sao Paulo, BR"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://empresa.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Tecnologias (separadas por virgula)</label>
          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Frameworks (separados por virgula)</label>
          <input
            name="frameworks"
            value={form.frameworks}
            onChange={handleChange}
            placeholder="Next.js, Express, NestJS"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Descricao</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descreva a sua empresa."
            rows={4}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition ${
            loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Criando empresa..." : "Criar empresa"}
        </button>
      </form>
    </section>
  );
};

export default CreateCompanyCard;
