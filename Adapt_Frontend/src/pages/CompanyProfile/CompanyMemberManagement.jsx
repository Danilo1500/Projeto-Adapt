import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/Language.js";
import { requestWithAuth } from "../../utils/authRequest";

const CompanyMemberManagement = ({ company, access, onChanged }) => {
  const { getToken } = useAuth();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === "dark";
  const isEnglish = language === "en";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [role, setRole] = useState("viewer");
  const [busyUserId, setBusyUserId] = useState("");

  const runSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const { data } = await requestWithAuth(getToken, (headers) =>
        api.post("/api/user/discover", { input: query.trim() }, { headers })
      );
      const memberIds = new Set((company.members || []).map((member) => String(member.userId || member._id)));
      setResults((data.users || []).filter((user) => !memberIds.has(String(user._id))));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSearching(false);
    }
  };

  const addMember = async (user) => {
    setBusyUserId(user._id);
    try {
      await requestWithAuth(getToken, (headers) =>
        api.post(`/api/company/${company._id}/members`, { userId: user._id, role }, { headers })
      );
      toast.success(isEnglish ? "Member added." : "Membro adicionado.");
      setResults((current) => current.filter((item) => item._id !== user._id));
      onChanged?.();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setBusyUserId("");
    }
  };

  const changeRole = async (member, nextRole) => {
    setBusyUserId(member.userId);
    try {
      await requestWithAuth(getToken, (headers) =>
        api.patch(`/api/company/${company._id}/members/${member.userId}`, { role: nextRole }, { headers })
      );
      onChanged?.();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setBusyUserId("");
    }
  };

  const removeMember = async (member) => {
    setBusyUserId(member.userId);
    try {
      await requestWithAuth(getToken, (headers) =>
        api.delete(`/api/company/${company._id}/members/${member.userId}`, { headers })
      );
      toast.success(isEnglish ? "Member removed." : "Membro removido.");
      onChanged?.();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setBusyUserId("");
    }
  };

  const surface = isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900";
  const input = isDark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-slate-300 bg-white text-slate-900";
  const editableRoles = access.role === "owner" ? ["admin", "recruiter", "viewer"] : ["recruiter", "viewer"];

  return (
    <section className={`mt-6 rounded-xl border p-4 sm:p-6 ${surface}`}>
      <h3 className="text-lg font-semibold">{isEnglish ? "Member access" : "Acesso de membros"}</h3>
      <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
        {isEnglish ? "Legacy members keep viewer access. Only the owner can grant admin." : "Membros antigos ficam como visualizadores. Só o responsável pode conceder admin."}
      </p>

      <div className="mt-4 space-y-3">
        {(company.members || []).map((member) => {
          const isOwner = member.role === "owner" || String(member.userId) === String(company.ownerId);
          const canManageMember = access.role === "owner" || (access.role === "admin" && !isOwner && member.role !== "admin");
          return (
            <div key={member.userId || member._id} className={`flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <div className="flex min-w-0 items-center gap-3">
                <img src={member.profile_picture || "https://placehold.co/64x64?text=User"} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{member.full_name || member.username || member.userId}</p>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{member.role} · {member.status}</p>
                </div>
              </div>
              {canManageMember && !isOwner && (
                <div className="flex gap-2">
                  <select aria-label={isEnglish ? "Member role" : "Papel do membro"} className={`min-w-0 rounded-md border px-2 py-2 text-sm ${input}`} value={member.role} disabled={busyUserId === member.userId} onChange={(event) => void changeRole(member, event.target.value)}>
                    {editableRoles.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                  <button type="button" className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50" disabled={busyUserId === member.userId} onClick={() => void removeMember(member)}>
                    {isEnglish ? "Remove" : "Remover"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={runSearch} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input value={query} onChange={(event) => setQuery(event.target.value)} className={`min-w-0 flex-1 rounded-md border px-3 py-2 text-sm ${input}`} placeholder={isEnglish ? "Find an existing ADAPT user" : "Buscar usuário existente no ADAPT"} />
        <select className={`rounded-md border px-3 py-2 text-sm ${input}`} value={role} onChange={(event) => setRole(event.target.value)}>
          {editableRoles.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <button type="submit" disabled={searching} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {searching ? (isEnglish ? "Searching…" : "Buscando…") : (isEnglish ? "Search" : "Buscar")}
        </button>
      </form>
      {!!results.length && (
        <ul className="mt-3 space-y-2">
          {results.slice(0, 8).map((user) => (
            <li key={user._id} className={`flex items-center justify-between gap-3 rounded-md border p-3 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <span className="min-w-0 truncate text-sm">{user.full_name} {user.username ? `@${user.username}` : ""}</span>
              <button type="button" disabled={busyUserId === user._id} onClick={() => void addMember(user)} className="shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-sm text-white disabled:opacity-60">
                {isEnglish ? "Add" : "Adicionar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CompanyMemberManagement;
