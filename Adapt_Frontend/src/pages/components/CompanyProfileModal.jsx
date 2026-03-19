import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import api from "../../api/axios";
import { Pencil } from "lucide-react";

const tagsToString = (values) => (Array.isArray(values) ? values.join(", ") : "");
const stringToTags = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const CompanyProfileModal = ({ company, setShowEdit, onSaved }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: company?.name || "",
    slug: company?.slug || "",
    industry: company?.industry || "",
    size: company?.size || "",
    location: company?.location || "",
    website: company?.website || "",
    description: company?.description || "",
    cover: null,
    logo: null,
    technologies: tagsToString(company?.technologies),
    frameworks: tagsToString(company?.frameworks),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Nome da empresa e obrigatorio.");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("slug", form.slug.trim());
      payload.append("industry", form.industry.trim());
      payload.append("size", form.size.trim());
      payload.append("location", form.location.trim());
      payload.append("website", form.website.trim());
      payload.append("description", form.description.trim());
      payload.append("technologies", stringToTags(form.technologies).join(","));
      payload.append("frameworks", stringToTags(form.frameworks).join(","));
      if (form.logo) payload.append("logo", form.logo);
      if (form.cover) payload.append("cover", form.cover);

      const { data } = await api.post("/api/company/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.success) {
        toast.error(data?.message || "Nao foi possivel salvar as alteracoes.");
        return;
      }

      toast.success("Empresa atualizada com sucesso.");
      onSaved?.();
      setShowEdit(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Erro ao atualizar empresa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50">
      <div className="max-w-2xl sm:py-6 mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Company</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  id="logo"
                  onChange={(event) => setForm((prev) => ({ ...prev, logo: event.target.files[0] }))}
                />
                <div className="group/logo relative">
                  <img
                    src={form.logo ? URL.createObjectURL(form.logo) : company?.logo || "https://placehold.co/96x96?text=Logo"}
                    alt=""
                    className="w-24 h-24 rounded-full object-cover mt-2"
                  />
                  <div className="absolute hidden group-hover/logo:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                </div>
              </label>
            </div>

            <div className="flex flex-col items-start gap-3">
              <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Photo
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  id="cover"
                  onChange={(event) => setForm((prev) => ({ ...prev, cover: event.target.files[0] }))}
                />
                <div className="group/cover relative">
                  <img
                    src={form.cover ? URL.createObjectURL(form.cover) : company?.cover || "https://placehold.co/640x240?text=Cover"}
                    alt=""
                    className="w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2"
                  />
                  <div className="absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-lg items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Company name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  placeholder="Technology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <input
                  type="text"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  placeholder="11-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Sao Paulo, BR"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="https://company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frameworks</label>
              <input
                type="text"
                name="frameworks"
                value={form.frameworks}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Next.js, Express"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Company description"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowEdit(false)}
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer disabled:opacity-70"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileModal;
