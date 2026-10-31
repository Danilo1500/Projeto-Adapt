import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { AlertCircle, BookOpen, BriefcaseBusiness, ExternalLink, GraduationCap, LoaderCircle, RefreshCw, Save, Search, Settings2, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/Language.js";
import { requestWithAuth } from "../../utils/authRequest";

const courseStatuses = [["want", "Quero fazer"], ["in_progress", "Em andamento"], ["completed", "Concluído"]];
const projectStatuses = [["planned", "Projeto planejado"], ["in_progress", "Projeto em andamento"], ["completed", "Projeto concluído"]];

const getCourseReason = (course, t) => {
  const skills = (course.reasonSkills || course.relatedSkills || []).join(", ");
  if (course.reasonKind === "compatible-gap") return t("Desenvolve {{skills}}, ainda não identificada em vagas compatíveis com seu perfil.").replace("{{skills}}", skills);
  if (course.reasonKind === "published-gap") return t("Desenvolve {{skills}}, citada em vagas publicadas.").replace("{{skills}}", skills);
  if (course.reasonKind === "goal") return t("Recomendado porque você informou interesse em desenvolver {{skills}}.").replace("{{skills}}", skills);
  if (course.reasonKind === "profile") return t("Aproveita sua base declarada em {{skills}} para construir evidências práticas.").replace("{{skills}}", skills);
  return t("Sugestão geral de aprendizagem para construir um portfólio demonstrável.");
};

export default function LearningPath() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const adaptUser = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const isDark = theme === "dark";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [loadError, setLoadError] = useState("");
  const [skillDrafts, setSkillDrafts] = useState({});
  const [targetRole, setTargetRole] = useState("");
  const [desiredSkills, setDesiredSkills] = useState("");
  const [search, setSearch] = useState("");
  const [technology, setTechnology] = useState("");
  const [level, setLevel] = useState("");
  const [provider, setProvider] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const panel = isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white";
  const muted = isDark ? "text-slate-400" : "text-slate-600";
  const input = isDark ? "border-white/10 bg-slate-950 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400";

  const load = useCallback(async () => {
    try {
      setLoadError("");
      const response = await requestWithAuth(getToken, (headers) =>
        api.get("/api/user/learning-recommendations", { headers })
      );
      setData(response.data);
      setSkillDrafts(Object.fromEntries((response.data.courses || []).map((course) => [course.id, (course.progress.acquiredSkills || []).join(", ")])));
      setTargetRole(response.data.diagnosis.targetRole || "");
      setDesiredSkills((response.data.diagnosis.desiredSkills || []).join(", "));
    } catch (error) {
      const message = error.response?.data?.message || t("Não foi possível carregar seu plano de aprendizagem.");
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [getToken, t]);

  useEffect(() => { load(); }, [load]);

  const saveProgress = async (courseId, updates) => {
    setSaving(courseId);
    try {
      await requestWithAuth(getToken, (headers) =>
        api.patch("/api/user/learning-progress", { courseId, ...updates }, { headers })
      );
      await load();
      toast.success(t("Progresso salvo. As recomendações foram atualizadas."));
    } catch (error) {
      toast.error(error.response?.data?.message || t("Não foi possível salvar o progresso."));
    } finally {
      setSaving("");
    }
  };

  const savePreferences = async () => {
    setSaving("preferences");
    try {
      await requestWithAuth(getToken, (headers) =>
        api.patch("/api/user/learning-preferences", {
          targetRole,
          desiredSkills: desiredSkills.split(",").map((skill) => skill.trim()).filter(Boolean),
        }, { headers })
      );
      await load();
      toast.success(t("Objetivos atualizados; recomendações recalculadas."));
    } catch (error) {
      toast.error(error.response?.data?.message || t("Não foi possível salvar seus objetivos."));
    } finally {
      setSaving("");
    }
  };

  const allCourses = data?.courses || [];
  const technologies = [...new Set(allCourses.flatMap((course) => course.relatedSkills || []))].sort();
  const levels = [...new Set(allCourses.map((course) => course.level).filter(Boolean))].sort();
  const providers = [...new Set(allCourses.map((course) => course.provider || course.platform).filter(Boolean))].sort();
  const filteredCourses = useMemo(() => allCourses.filter((course) => {
    const text = `${course.title} ${course.description}`.toLowerCase();
    return (!search || text.includes(search.toLowerCase()))
      && (!technology || course.relatedSkills?.includes(technology))
      && (!level || course.level === level)
      && (!provider || (course.provider || course.platform) === provider);
  }), [allCourses, search, technology, level, provider]);

  if (loading) return <div className={`flex min-h-full items-center justify-center ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"}`}><LoaderCircle className="animate-spin text-indigo-500" /></div>;

  const displayName = adaptUser?.full_name?.trim().split(/\s+/)[0]
    || user?.firstName?.trim()
    || user?.fullName?.trim().split(/\s+/)[0]
    || adaptUser?.username?.trim()
    || user?.username?.trim()
    || "";
  const identifiedSkills = data?.diagnosis?.identifiedSkills || [];
  const gaps = data?.diagnosis?.skillsToDevelop || [];
  const desired = data?.diagnosis?.desiredSkills || [];

  return (
    <main className={`min-h-full overflow-y-auto ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-950"}`}>
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <header className={`relative overflow-hidden rounded-3xl border px-5 py-7 sm:px-8 sm:py-9 ${panel}`}>
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
                <GraduationCap size={18} /> ADAPT · Desenvolvimento profissional
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{t("Evolua seu portfólio")}</h1>
              <p className={`mt-3 max-w-2xl text-sm leading-6 sm:text-base ${muted}`}>
                {displayName ? `${t("Olá")}, ${displayName}. ` : `${t("Olá")}. `}
                {t("Transforme suas competências em evidências práticas com cursos oficiais e projetos relevantes.")}
              </p>
            </div>
            <button type="button" onClick={() => { setLoading(true); load(); }} className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50"}`}>
              <RefreshCw size={16} /> {t("Atualizar")}
            </button>
          </div>
          {data?.criteria && (
            <div className={`mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5 text-xs ${isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"}`}>
              <span>{allCourses.length} {t("recursos recomendados")}</span>
              <span>{data.criteria.vacanciesAnalyzed || 0} {t("vagas analisadas")}</span>
              <span>{data.criteria.catalogCourses || 0} {t("recursos no catálogo")}</span>
            </div>
          )}
        </header>

        {loadError && (
          <div className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 ${isDark ? "border-rose-400/30 bg-rose-950/30 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div><p className="font-medium">{t("Não foi possível carregar as recomendações.")}</p><p className="mt-1 text-sm opacity-80">{loadError}</p></div>
          </div>
        )}

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)]">
          <div className={`rounded-3xl border p-5 sm:p-6 ${panel}`}>
            <div className="flex items-center gap-2"><Target size={19} className="text-indigo-500" /><h2 className="font-semibold">{t("Seu desenvolvimento profissional")}</h2></div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>{t("Competências atuais")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {identifiedSkills.length ? identifiedSkills.map((skill) => <span key={skill} className={`rounded-full px-3 py-1.5 text-sm ${isDark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}>{skill}</span>) : <span className={`text-sm ${muted}`}>{t("Nenhuma competência cadastrada.")}</span>}
                </div>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>{t("Competências a desenvolver")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {gaps.length ? gaps.map(({ skill, vacancyCount }) => <span key={skill} className={`rounded-full px-3 py-1.5 text-sm ${isDark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-50 text-indigo-700"}`}>{skill}{vacancyCount ? ` · ${vacancyCount}` : ""}</span>) : desired.map((skill) => <span key={skill} className={`rounded-full px-3 py-1.5 text-sm ${isDark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-50 text-indigo-700"}`}>{skill}</span>)}
                  {!gaps.length && !desired.length && <span className={`text-sm ${muted}`}>{t("Sem lacunas identificadas.")}</span>}
                </div>
              </div>
            </div>
            <div className={`mt-5 border-t pt-5 text-sm leading-6 ${muted} ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <p><strong className={isDark ? "text-slate-200" : "text-slate-800"}>{t("Próximo passo")}:</strong> {identifiedSkills.length ? t("Escolha um curso alinhado a uma lacuna real e transforme o projeto sugerido em evidência pública.") : t("Adicione competências ao seu perfil para receber recomendações mais precisas.")}</p>
            </div>
          </div>

          <div className={`rounded-3xl border p-5 sm:p-6 ${panel}`}>
            <div className="flex items-center gap-2"><BriefcaseBusiness size={19} className="text-indigo-500" /><h2 className="font-semibold">{t("Objetivos profissionais")}</h2></div>
            <label className={`mt-5 block text-xs font-medium ${muted}`}>{t("Área desejada")}
              <input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} maxLength={100} placeholder={t("Ex.: Frontend")} className={`mt-2 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 ${input}`} />
            </label>
            <label className={`mt-4 block text-xs font-medium ${muted}`}>{t("Competências a desenvolver")}
              <input value={desiredSkills} onChange={(event) => setDesiredSkills(event.target.value)} placeholder={t("React, TypeScript, Docker")} className={`mt-2 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 ${input}`} />
            </label>
            <button type="button" onClick={savePreferences} disabled={saving === "preferences"} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 disabled:opacity-60">
              {saving === "preferences" ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} {t("Salvar objetivos")}
            </button>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="course-heading">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500"><Sparkles size={16} /> {t("Para seu plano")}</p><h2 id="course-heading" className="mt-2 text-2xl font-semibold tracking-tight">{t("Cursos recomendados")}</h2></div>
            <button type="button" onClick={() => navigate("/profile")} className={`inline-flex items-center gap-2 text-sm font-medium text-indigo-500 ${muted}`}><Settings2 size={16} /> {t("Completar perfil")}</button>
          </div>

          <div className={`mt-5 grid gap-3 rounded-2xl border p-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(150px,.55fr))] ${panel}`}>
            <label className="relative"><Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${muted}`} size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(6); }} placeholder={t("Pesquisar curso")} className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 ${input}`} /></label>
            {[["technology", technology, setTechnology, t("Tecnologia"), technologies], ["level", level, setLevel, t("Nível"), levels], ["provider", provider, setProvider, t("Provedor"), providers]].map(([name, value, setter, label, options]) => (
              <label key={name} className="relative"><select value={value} onChange={(event) => { setter(event.target.value); setVisibleCount(6); }} className={`w-full appearance-none rounded-xl border px-3.5 py-2.5 pr-9 text-sm outline-none focus:border-indigo-500 ${input}`}>
                <option value="">{label}: {t("Todas")}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌄</span></label>
            ))}
          </div>

          {!filteredCourses.length && <div className={`mt-5 rounded-2xl border p-8 text-center ${panel}`}><BookOpen className="mx-auto text-indigo-500" /><p className="mt-3 font-medium">{t("Nenhum curso encontrado.")}</p><p className={`mt-1 text-sm ${muted}`}>{t("Ajuste os filtros ou complete o perfil para ampliar as recomendações.")}</p></div>}
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.slice(0, visibleCount).map((course) => (
              <article key={course.id} className={`group flex min-h-[430px] flex-col rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:border-indigo-400/60 hover:shadow-xl hover:shadow-indigo-950/5 ${panel}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="line-clamp-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-500">{course.provider || course.platform}</span>
                  {course.cost && <span className={`shrink-0 text-xs ${muted}`}>{t(course.cost)}</span>}
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-6">{course.title}</h3>
                <p className={`mt-2 line-clamp-3 text-sm leading-6 ${muted}`}>{course.description}</p>
                <div className={`mt-4 flex flex-wrap gap-2 border-y py-3 text-xs ${isDark ? "border-white/10 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                  <span>{course.level || t("Nível não informado")}</span>
                  {course.duration && <><span>·</span><span>{course.duration}</span></>}
                  {course.language && <><span>·</span><span>{course.language}</span></>}
                </div>
                <p className={`mt-4 text-sm leading-6 ${muted}`}><strong className={isDark ? "text-slate-200" : "text-slate-800"}>{t("Por quê")}: </strong>{getCourseReason(course, t)}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{course.relatedSkills.map((skill) => <span key={skill} className={`rounded-md px-2 py-1 text-xs ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{skill}</span>)}</div>
                {course.project && (
                  <div className={`mt-4 rounded-xl p-3 text-xs leading-5 ${isDark ? "bg-slate-800/70 text-slate-400" : "bg-slate-50 text-slate-600"}`}>
                    <strong className={isDark ? "text-slate-200" : "text-slate-800"}>{t("Projeto")}: </strong>{course.project.title}
                  </div>
                )}
                <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                  <label className={`text-xs ${muted}`}>{t("Status")}
                    <select value={course.progress.status} onChange={(event) => saveProgress(course.id, { status: event.target.value })} disabled={saving === course.id} className={`mt-1.5 w-full rounded-xl border px-2 py-2 text-xs ${input}`}>
                      {courseStatuses.map(([value, label]) => <option key={value} value={value}>{t(label)}</option>)}
                    </select>
                  </label>
                  <label className={`text-xs ${muted}`}>{t("Projeto")}
                    <select value={course.progress.projectStatus} onChange={(event) => saveProgress(course.id, { projectStatus: event.target.value })} disabled={saving === course.id} className={`mt-1.5 w-full rounded-xl border px-2 py-2 text-xs ${input}`}>
                      {projectStatuses.map(([value, label]) => <option key={value} value={value}>{t(label)}</option>)}
                    </select>
                  </label>
                </div>
                <input value={skillDrafts[course.id] || ""} onChange={(event) => setSkillDrafts((current) => ({ ...current, [course.id]: event.target.value }))} placeholder={t("Competências adquiridas")} className={`mt-3 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-indigo-500 ${input}`} />
                <div className="mt-3 grid grid-cols-[auto_1fr] gap-2">
                  <button type="button" onClick={() => saveProgress(course.id, { acquiredSkills: (skillDrafts[course.id] || "").split(",").map((skill) => skill.trim()).filter(Boolean) })} disabled={saving === course.id} className={`inline-flex items-center justify-center rounded-xl border px-3 py-2.5 ${isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50"}`} aria-label={t("Salvar competências")}><Save size={16} /></button>
                  <a href={course.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white">{t("Acessar curso")} <ExternalLink size={15} /></a>
                </div>
              </article>
            ))}
          </div>
          {filteredCourses.length > visibleCount && (
            <div className="mt-6 text-center"><button type="button" onClick={() => setVisibleCount((count) => count + 6)} className={`rounded-xl border px-5 py-2.5 text-sm font-medium ${isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 bg-white hover:bg-slate-50"}`}>{t("Carregar mais")}</button></div>
          )}
        </section>
      </div>
    </main>
  );
}
