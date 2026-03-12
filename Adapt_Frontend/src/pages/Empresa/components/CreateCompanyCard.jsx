import { useState } from "react";
import { useAuth, useOrganizationList } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/axios";

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

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Cadastro da empresa</h2>
      <p className="mt-2 text-sm text-slate-600">
        A organizaÃ§Ã£o Ã© criada no Clerk e sincronizada no banco via Inngest.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nome da empresa *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex.: Adapt Tech"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Setor</label>
            <input
              name="industry"
              value={form.industry}
              onChange={handleChange}
              placeholder="Tecnologia"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tamanho</label>
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="11-50 colaboradores"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Localizacao</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Sao Paulo, BR"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Website</label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://empresa.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tecnologias (separadas por virgula)
          </label>
          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Frameworks (separados por virgula)
          </label>
          <input
            name="frameworks"
            value={form.frameworks}
            onChange={handleChange}
            placeholder="Next.js, Express, NestJS"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Descricao</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descreva a sua empresa."
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
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

